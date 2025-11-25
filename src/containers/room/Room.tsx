interface RoomContainerProps {
  roomId?: string;
}
export const RoomContainer: React.FC<RoomContainerProps> = ({ roomId }) => {
  return <div>Room Container: {roomId}</div>;
};
