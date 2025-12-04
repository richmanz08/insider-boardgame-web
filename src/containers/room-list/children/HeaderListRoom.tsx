import { Button } from "@/src/components/button/Button";
import { Typography } from "@/src/components/text/Typography";

interface HeaderListRoomProps {
  onRefresh: () => void;
  isRefetching: boolean;
  onCreateRoom: () => void;
  length?: number;
}
export const HeaderListRoom: React.FC<HeaderListRoomProps> = ({
  onRefresh,
  isRefetching,
  onCreateRoom,
  length,
}) => {
  return (
    <div className="flex flex-col items-end">
      <div className="w-full">
        <Typography type="title">รายการห้อง</Typography>
        <Typography type="body" className="text-gray-400">
          เลือกห้องเพื่อเข้าร่วมหรือสร้างห้องใหม่
        </Typography>
      </div>

      <div className="flex justify-between items-center w-full mt-8 mb-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <i className="pi pi-info-circle" />
          <span>พบ {length} ห้อง</span>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            icon={isRefetching ? "pi pi-spin pi-spinner" : "pi pi-refresh"}
            onClick={onRefresh}
            severity="secondary"
            outlined
            size="large"
            disabled={isRefetching}
          />
          <Button
            label="สร้างห้อง"
            icon="pi pi-plus"
            onClick={() => onCreateRoom()}
            // severity="indigo"
            severity="secondary"
            size="large"
            // size="small"
            outlined
          />
        </div>
      </div>
    </div>
  );
};
