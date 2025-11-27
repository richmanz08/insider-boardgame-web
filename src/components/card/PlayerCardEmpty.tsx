import { Card } from "primereact/card";

export const PlayerCardEmpty = () => {
  return (
    <Card className="opacity-50 border-dashed">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-500">
          <i className="pi pi-user text-2xl" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-500">รอผู้เล่น...</h3>
          <p className="text-sm text-gray-600">ช่องว่าง</p>
        </div>
      </div>
    </Card>
  );
};
