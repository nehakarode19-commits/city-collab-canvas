import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, Users, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateChannelModal } from "@/components/collaboration/CreateChannelModal";

interface Channel {
  id: string;
  name: string;
  description: string | null;
  department: { name: string } | null;
  created_at: string;
  message_count?: number;
}

export default function Collaboration() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("channels")
      .select(`
        *,
        department:departments(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load channels",
        variant: "destructive",
      });
    } else {
      // Fetch message counts for each channel
      const channelsWithCounts = await Promise.all(
        (data || []).map(async (channel) => {
          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("channel_id", channel.id);
          return { ...channel, message_count: count || 0 };
        })
      );
      setChannels(channelsWithCounts);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Collaboration Channels</h1>
          <p className="text-muted-foreground mt-1">
            Department-based discussions and communications
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Channel
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading channels...</p>
        </div>
      ) : channels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No channels yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first channel to start collaborating
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((channel) => (
            <Card
              key={channel.id}
              className="group cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1" onClick={() => navigate(`/collaboration/${channel.id}`)}>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <span className="group-hover:text-primary transition-colors">{channel.name}</span>
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast({ title: "Coming soon", description: "Channel settings" });
                    }}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                {channel.department && (
                  <Badge variant="secondary" className="w-fit mt-2">
                    {channel.department.name}
                  </Badge>
                )}
              </CardHeader>
              <CardContent 
                className="space-y-3 pb-4"
                onClick={() => navigate(`/collaboration/${channel.id}`)}
              >
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {channel.description || "No description available"}
                </p>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{channel.message_count || 0} messages</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateChannelModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={fetchChannels}
      />
    </div>
  );
}
