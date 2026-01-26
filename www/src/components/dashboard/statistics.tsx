import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "motion/react";

export function StatisticCard({
  title,
  amount,
  icon,
  animationKey,
}: {
  title: string;
  amount: number | string;
  icon: React.ReactNode;
  animationKey?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeIn" }}
        className="w-full dark:bg-theme rounded-none border"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-foreground font-medium">
              {title}
            </CardTitle>
            {icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-foreground">{amount}</div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
