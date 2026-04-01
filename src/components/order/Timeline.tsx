import { Timeline as AntTimeline } from "antd";
import dayjs from "dayjs";
import type { TimelineEvent } from "../../types/domain";

type Props = {
  events: TimelineEvent[];
};

export function Timeline({ events }: Props) {
  return (
    <AntTimeline
      items={events
        .slice()
        .reverse()
        .map((event) => ({
          children: `${event.text} · ${dayjs(event.ts).format("HH:mm:ss")}`,
        }))}
    />
  );
}
