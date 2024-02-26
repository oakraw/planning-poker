export interface Issue {
  issueId: string;
  issueTitle: string;
  point?: number;
  isLock: boolean;
  isPin: boolean;
  createdAt?: Date;
}



