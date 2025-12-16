import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Paperclip, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  created_at: string;
  user: {
    full_name: string;
    email: string;
  };
  file_name: string | null;
  file_path: string | null;
}

export default function ChannelView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [channel, setChannel] = useState<any>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchChannel();
      fetchChannels();
      fetchMessages();
      getCurrentUser();
      subscribeToMessages();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
    }
  };

  const fetchChannel = async () => {
    const { data, error } = await supabase
      .from("channels")
      .select(`
        *,
        department:departments(name)
      `)
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load channel",
        variant: "destructive",
      });
      navigate("/collaboration");
    } else {
      setChannel(data);
    }
  };

  const fetchChannels = async () => {
    const { data } = await supabase
      .from("channels")
      .select("id, name")
      .order("name");
    setChannels(data || []);
  };

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        user:profiles!messages_user_id_fkey(full_name, email)
      `)
      .eq("channel_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages:${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${id}`,
        },
        async (payload) => {
          // Fetch the complete message with user data
          const { data } = await supabase
            .from("messages")
            .select(`
              *,
              user:profiles!messages_user_id_fkey(full_name, email)
            `)
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setMessages((prev) => [...prev, data]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !file) || !currentUserId) return;

    setSending(true);
    
    let filePath = null;
    let fileName = null;

    // Upload file if attached
    if (file) {
      const fileExt = file.name.split(".").pop();
      const uploadFileName = `${currentUserId}-${Date.now()}.${fileExt}`;
      const uploadPath = `${id}/${uploadFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("message-attachments")
        .upload(uploadPath, file);

      if (uploadError) {
        toast({
          title: "Error",
          description: "Failed to upload file",
          variant: "destructive",
        });
        setSending(false);
        return;
      }

      filePath = uploadPath;
      fileName = file.name;
    }

    const { error } = await supabase.from("messages").insert({
      channel_id: id,
      user_id: currentUserId,
      content: newMessage.trim() || "(File attachment)",
      file_path: filePath,
      file_name: fileName,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } else {
      setNewMessage("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    setSending(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!channel) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Left Sidebar - Channel List */}
      <Card className="w-64 flex-shrink-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Channels</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => navigate("/collaboration")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-1">
              {channels.map((ch) => (
                <Button
                  key={ch.id}
                  variant={ch.id === id ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm font-normal"
                  onClick={() => navigate(`/collaboration/${ch.id}`)}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{ch.name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Channel Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{channel.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {channel.department?.name && `${channel.department.name} • `}
            {channel.description}
          </p>
        </div>

        {/* Messages Area */}
        <Card className="flex-1 flex flex-col min-h-0">
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground font-medium">No messages yet</p>
                  <p className="text-sm text-muted-foreground/75 mt-1">
                    Start the conversation!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const showDate = index === 0 || 
                      new Date(messages[index - 1].created_at).toDateString() !== 
                      new Date(message.created_at).toDateString();
                    
                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 border-t" />
                            <span className="text-xs text-muted-foreground font-medium">
                              {new Date(message.created_at).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                            <div className="flex-1 border-t" />
                          </div>
                        )}
                        <div className="flex gap-3 hover:bg-muted/30 -mx-2 px-2 py-1 rounded-lg transition-colors group">
                          <Avatar className="h-9 w-9 mt-0.5">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                              {getInitials(message.user.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-semibold text-sm">
                                {message.user.full_name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed break-words">{message.content}</p>
                            {message.file_name && (
                              <div className="mt-2 inline-flex items-center gap-2 text-xs bg-muted/50 px-3 py-1.5 rounded border">
                                <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="font-medium">{message.file_name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="space-y-2">
                {file && (
                  <div className="flex items-center gap-2 text-sm bg-muted/50 px-3 py-2 rounded">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate font-medium">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => {
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={sending}
                    className="flex-1"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={sending}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={sending || (!newMessage.trim() && !file)}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
