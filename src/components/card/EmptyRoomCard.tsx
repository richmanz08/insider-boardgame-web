import { Card } from "primereact/card";
import { Typography } from "../text/Typography";

export const EmptyRoomCard: React.FC = () => {
  return (
    <Card>
      <div className="text-center py-16">
        <i className="pi pi-inbox text-4xl text-gray-400 mb-4" />
        <Typography type="label" className="text-gray-400">
          ยังไม่มีห้องในระบบ
        </Typography>
        <Typography type="description" className="text-gray-500 mt-2a">
          คลิกปุ่ม &quot;สร้างห้อง&quot; เพื่อเริ่มเกมใหม่
        </Typography>
      </div>
    </Card>
  );
};
