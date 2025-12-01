import { Card } from "primereact/card";

export const RuleUI = () => {
  return (
    <div className="mb-8">
      <Card className="bg-gray-800 border-2 border-gray-700">
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <i className="pi pi-info-circle text-yellow-400" />
            เกณฑ์การให้คะแนน
          </h3>
          <div className="space-y-2 text-gray-300">
            <div className="flex items-start gap-2">
              <i className="pi pi-user text-blue-400 mt-1" />
              <p>
                <span className="text-blue-400 font-semibold">CITIZEN:</span>{" "}
                ถ้าสามารถตอบถูก จะได้ 1 คะแนน เมื่อผู้เล่นส่วนใหญ่โหวต Insider
                ถูก (เกิน 50%) จะได้เพิ่มอีก 1 คะแนน
              </p>
            </div>
            <div className="flex items-start gap-2">
              <i className="pi pi-eye text-red-400 mt-1" />
              <p>
                <span className="text-red-400 font-semibold">Insider:</span> ได้
                1 คะแนน เมื่อทีมตอบถูกภายในเวลา และ +1 คะแนนเพิ่ม หากไม่ถูกจับ
                (แต่ CITIZEN ต้องตอบถูกด้วย)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <i className="pi pi-crown text-purple-400 mt-1" />
              <p>
                <span className="text-purple-400 font-semibold">Master:</span>{" "}
                ได้ 1 คะแนนทันทีเมื่อเป็น role นี้ และ +1 คะแนนเพิ่มหากสามารถจับ
                INSIDER ได้ด้วยตัวเอง
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
