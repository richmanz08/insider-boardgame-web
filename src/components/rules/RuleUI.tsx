import { Card } from "primereact/card";
import { Typography } from "../text/Typography";

export const RuleUI = () => {
  const rules = [
    {
      role: "Citizen",
      icon: "pi-users",
      color: "text-blue-400",
      points: ["ตอบถูก +1", "โหวต Insider ถูก (>50%) +1"],
    },
    {
      role: "Insider",
      icon: "pi-eye",
      color: "text-red-400",
      points: ["ทีมตอบถูกภายในเวลา +1", "ไม่ถูกจับ +1"],
      note: "* Citizen ต้องตอบถูกด้วย",
    },
    {
      role: "Master",
      icon: "pi-crown",
      color: "text-purple-400",
      points: ["เป็น Master +1", "จับ Insider ได้ +1"],
    },
  ];

  return (
    <div className="mb-6">
      <Card className="bg-gray-800 border border-gray-700">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <i className="pi pi-info-circle text-yellow-400 text-xl" />
            <Typography type="subheader" className="text-white">
              เกณฑ์การให้คะแนน
            </Typography>
          </div>

          {/* Rules */}
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.role} className="flex items-start gap-3">
                <i className={`pi ${rule.icon} ${rule.color} text-lg mt-0.5`} />
                <div className="flex-1">
                  <Typography type="label" className={rule.color}>
                    {rule.role}
                  </Typography>
                  <div className="space-y-1 mt-1">
                    {rule.points.map((point, idx) => (
                      <Typography
                        key={idx}
                        type="body"
                        className="text-gray-300 text-sm"
                      >
                        • {point}
                      </Typography>
                    ))}
                    {rule.note && (
                      <Typography type="small" className="text-gray-500 italic">
                        {rule.note}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
