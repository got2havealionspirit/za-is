import dayjs from "dayjs";

export const computeFeedScore = ({
  likes,
  comments,
  createdAt
}: {
  likes: number;
  comments: number;
  createdAt: string;
}) => {
  const hoursOld = dayjs().diff(dayjs(createdAt), "hour", true);
  const freshness = Math.max(1, 72 - hoursOld);
  return likes * 2 + comments + freshness;
};
