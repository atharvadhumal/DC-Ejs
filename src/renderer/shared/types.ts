export interface IMainState {
  value: number;
}

export interface IServerBtn {
  icon?: any;
  img?: string;
  title: string;
  url: string;
}

export interface IChannelList {
  title:string;
  channels?: Array<{ title: string; url: string; icon: any }>;
}

export interface IChannelListItem {
  url: string;
  title: any;
  icon?:any;
  tools: boolean;
  isActive?:boolean;
}
