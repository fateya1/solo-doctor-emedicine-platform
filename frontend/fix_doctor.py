f = open('src/app/dashboard/doctor/page.tsx', 'r', encoding='utf-8')
c = f.read()
f.close()

# 1. Expand Tab type
c = c.replace(
    'type Tab = "appointments" | "slots" | "analytics" | "subscription";',
    'type Tab = "appointments" | "slots" | "analytics" | "subscription" | "messages";'
)

# 2. Add imports
c = c.replace(
    'import { VideoButton } from "@/components/video-button";',
    'import { VideoButton } from "@/components/video-button";\nimport { ChatPanel } from "@/components/chat";\nimport { MessageSquare } from "lucide-react";'
)

# 3. Add messages to tabs array
c = c.replace(
    '    { key: "subscription", label: t("nav", "subscription") },\n  ];',
    '    { key: "subscription", label: t("nav", "subscription") },\n    { key: "messages", label: "Messages" },\n  ];'
)

# 4. Add messages tab panel before closing </div> of tab content area
old_panel = '      {/* Modals */}'
new_panel = '''      {/* Messages Tab */}
      {tab === "messages" && (
        <div className="card">
          <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-600" /> Patient Messages
          </h2>
          <ChatPanel role="doctor" />
        </div>
      )}

      {/* Modals */}'''

c = c.replace(old_panel, new_panel, 1)

open('src/app/dashboard/doctor/page.tsx', 'w', encoding='utf-8').write(c)
print('Doctor dashboard done')
