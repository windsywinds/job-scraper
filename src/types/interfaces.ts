export interface Job {
    [key: string]: any;
  }
  
export interface JobListing {
    applyLink: string;
    title?: string;
    workStyle?: string;
    workType?: string;
    seniority?: string;
    locations?: string;
    timing?: string;
    areas?: string;
    description?: string;
  }

interface SlackTextBlock {
  type: 'section' | 'context' | 'divider' | 'rich_text';
  text?: {
    type: 'mrkdwn' | 'plain_text';
    text: string;
  };
  elements?: {
    type: 'rich_text_list';
    style: 'bullet';
    elements: {
      type: 'rich_text_section';
      elements: {
        type: 'text' | 'emoji';
        text?: string;
        style?: { bold: boolean };
        name?: string;
      }[];
    }[];
  }[];
}

export interface SlackMessage {
  blocks: SlackTextBlock[];
}