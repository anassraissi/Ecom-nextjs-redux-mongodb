// utils/timeAgo.js
import { formatDistanceToNow, format, differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';

export const timeAgo = (date) => {
    const reviewDate = new Date(date);
    const daysDifference = differenceInDays(new Date(), reviewDate);
    const weeksDifference = differenceInWeeks(new Date(), reviewDate);
    const monthsDifference = differenceInMonths(new Date(), reviewDate);

    if (daysDifference < 1) {
        return formatDistanceToNow(reviewDate, { addSuffix: true });
    } else if (daysDifference < 7) {
        return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
    } else if (weeksDifference < 4) {
      return `${weeksDifference} week${weeksDifference > 1 ? 's' : ''} ago`;
    } else if (monthsDifference < 12) {
      return `${monthsDifference} month${monthsDifference > 1 ? 's' : ''} ago`;
    } else {
        return format(reviewDate, 'PPpp');
    }
};