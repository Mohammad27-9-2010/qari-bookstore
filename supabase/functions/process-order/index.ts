
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

interface OrderRequest {
  items: Array<{
    book: {
      id: number;
      title: string;
      price: number;
    };
    quantity: number;
  }>;
  email: string;
  phoneNumber: string;
  totalAmount: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)
    const { items, email, phoneNumber, totalAmount }: OrderRequest = await req.json()

    // Get the user ID from the authorization header
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1]
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader)
    
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Update user's profile with phone number if provided
    if (phoneNumber) {
      await supabase
        .from('profiles')
        .update({ phone_number: phoneNumber })
        .eq('id', user.id)
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        shipping_address: { email, phone_number: phoneNumber },
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      book_id: item.book.id,
      quantity: item.quantity,
      price_at_time: item.book.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // Send email to admin
    const orderDetails = items
      .map(item => `${item.book.title} (${item.quantity}x) - $${(item.book.price * item.quantity).toFixed(2)}`)
      .join('\n')

    await resend.emails.send({
      from: "Qari Bookstore <onboarding@resend.dev>",
      to: "Qaree.bookshop@gmail.com",
      subject: `New Order #${order.id}`,
      html: `
        <h1>New Order Received</h1>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Customer Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
        <h2>Items:</h2>
        <pre>${orderDetails}</pre>
      `,
    })

    return new Response(
      JSON.stringify({ message: "Order processed successfully", orderId: order.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Error processing order:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
