export const formatJobType = (type: string) => {
  switch (type) {
    case "FULLTIME":
      return "Full-time";
    case "PARTTIME":
      return "Part-time";
    case "FULLTIME_PARTTIME":
      return "Full-time or Part-time";
    case "INTERNSHIP":
      return "Internship";
    case "CONTRACT":
      return "Contract";
    default:
      return type;
  }
};
