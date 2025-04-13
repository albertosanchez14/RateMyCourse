import { motion } from "framer-motion";

interface ReviewTypeSelectorProps {
  commentsType: "course" | "professor";
  onTypeChange: (type: "course" | "professor") => void;
}

export default function ReviewTypeSelector({
  commentsType,
  onTypeChange,
}: ReviewTypeSelectorProps) {
  const tabVariants = {
    active: { 
      opacity: 1,
      transition: { type: 'spring', stiffness: 500, damping: 30 }
    },
    inactive: { 
      opacity: 0.3,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="flex flex-row gap-6">
      <div> 
        <motion.h3
          className="text-lg font-semibold m-2 cursor-pointer"
          onClick={() => onTypeChange("course")}
          variants={tabVariants}
          animate={commentsType === "course" ? "active" : "inactive"}
          whileHover={{ scale: 1.05 }}
        >
          Course Reviews
        </motion.h3>
      </div>
      {/* TODO: Uncomment when proffesors reviews are available */}
      {/* <div>
        <motion.h3
          className="text-lg font-semibold m-2 cursor-pointer"
          onClick={() => onTypeChange("professor")}
          variants={tabVariants}
          animate={commentsType === "professor" ? "active" : "inactive"}
          whileHover={{ scale: 1.05 }}
        >
          Professor Reviews
        </motion.h3>
      </div> */}
    </div>
  );
}