import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineChatAlt2, HiOutlinePaperAirplane } from "react-icons/hi";
import { workspaceKeys } from "../../../features/workspace/workspaceKeys";
import { useCreateMessage, useMessages } from "../../../features/workspace/hooks/useWorkspace";
import DashboardShell from "./DashboardShell";

const Messages = () => {
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useMessages();
  const createMessage = useCreateMessage();
  const [form, setForm] = useState({ subject: "", body: "" });

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.body.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    await createMessage.mutateAsync(form);
    queryClient.invalidateQueries({ queryKey: workspaceKeys.messages });
    setForm({ subject: "", body: "" });
    toast.success("Message posted");
  };

  return (
    <DashboardShell
      title="Messages"
      subtitle="Send class announcements and keep communication visible for everyone in the learning workspace."
      icon={HiOutlineChatAlt2}
    >
      <form onSubmit={sendMessage} className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <input
          value={form.subject}
          onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
          placeholder="Subject"
          className="rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
        />
        <textarea
          value={form.body}
          onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
          placeholder="Write an announcement or direct message..."
          className="min-h-28 rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
        />
        <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white">
          <HiOutlinePaperAirplane /> Send message
        </button>
      </form>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading messages...</div>
        ) : messages.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {messages.map((message: any) => (
              <article key={message._id} className="p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">{message.subject}</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{message.body}</p>
                    <p className="mt-3 text-xs text-gray-400">
                      {message.sender?.fullName || "User"} {message.classroom?.name ? `in ${message.classroom.name}` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(message.createdAt).toLocaleString()}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">No messages yet.</div>
        )}
      </section>
    </DashboardShell>
  );
};

export default Messages;
