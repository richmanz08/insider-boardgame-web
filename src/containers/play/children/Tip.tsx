import { Card } from "primereact/card";

export const Tip = () => {
  return (
    <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      <Card className="bg-gray-800/50 border border-gray-700">
        <div className="text-center p-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 mx-auto mb-3 flex items-center justify-center">
            <i className="pi pi-comments text-white text-xl" />
          </div>
          <h3 className="font-bold text-white mb-2">คุยกันในชีวิตจริง</h3>
          <p className="text-sm text-gray-400">
            ไม่ต้องพิมพ์คำถามหรือคำตอบในระบบ
          </p>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border border-gray-700">
        <div className="text-center p-4">
          <div className="w-12 h-12 rounded-full bg-purple-600 mx-auto mb-3 flex items-center justify-center">
            <i className="pi pi-search text-white text-xl" />
          </div>
          <h3 className="font-bold text-white mb-2">ค้นหาคำตอบ</h3>
          <p className="text-sm text-gray-400">
            ตั้งคำถามที่ดีเพื่อหาคำตอบให้ได้
          </p>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border border-gray-700">
        <div className="text-center p-4">
          <div className="w-12 h-12 rounded-full bg-red-600 mx-auto mb-3 flex items-center justify-center">
            <i className="pi pi-eye text-white text-xl" />
          </div>
          <h3 className="font-bold text-white mb-2">จับ Insider</h3>
          <p className="text-sm text-gray-400">
            สังเกตใครที่พยายามบงการผู้เล่น
          </p>
        </div>
      </Card>
    </div>
  );
};
