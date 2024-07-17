"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Session } from '@supabase/supabase-js'
import Filter from 'bad-words'

type Message = {
  id: number
  content: string
  user_email: string
  created_at: string
  avatar_url?: string
}

interface ChatProps {
  session: Session | null;
  avatarUrl: string;
  userEmail: string;
  isLoggedIn: boolean;
}

export default function Chat({ session, avatarUrl, userEmail, isLoggedIn }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<Filter | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    setFilter(new Filter())
  }, [])

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) {
      console.error('Error fetching messages:', error)
    } else {
      setMessages(data || [])
    }
  }, [supabase])

  useEffect(() => {
    fetchMessages()
    const messagesSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setMessages(prevMessages => [...prevMessages, payload.new as Message])
      })
      .subscribe()

    return () => {
      messagesSubscription.unsubscribe()
    }
  }, [supabase, fetchMessages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoggedIn) {
      alert('Please sign in to send a message')
      return
    }
    if (!newMessage.trim() || !filter) return

    setIsLoading(true)

    try {
      const filteredMessage = filter.clean(newMessage)
      const { error } = await supabase
        .from('messages')
        .insert({ content: filteredMessage, user_email: userEmail, avatar_url: avatarUrl })
      if (error) throw error
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function getInitials(email: string) {
    return email.split('@')[0].substring(0, 2).toUpperCase()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chat Room</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4">
          {messages.map(message => (
            <div key={message.id} className="flex items-start space-x-4 mb-4">
              <Avatar>
                <AvatarImage src={message.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.user_email)}`} />
                <AvatarFallback>{getInitials(message.user_email)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{message.user_email.split('@')[0]}</p>
                <p className="text-sm text-muted-foreground">{message.content}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        {!isLoggedIn ? (
          <p>Please sign in to send messages.</p>
        ) : (
          <form onSubmit={sendMessage} className="flex w-full space-x-2">
            <Input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-grow"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </form>
        )}
      </CardFooter>
    </Card>
  )
}