import { Type } from "@prisma/client";

export const formatJobType = (type:Type) => {
    switch (type) {
        case 'fulltime':
            return 'Full-Time';
        case 'parttime':
            return 'Part-Time';
        case 'internship':
            return 'Internship';
        case 'contract':
            return 'Contract';
        default:
            return type;
    }
  };