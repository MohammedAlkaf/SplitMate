declare module 'graphql-subscriptions' {
  import { PubSubEngine } from 'graphql-subscriptions';

  export class PubSub implements PubSubEngine {
    publish(triggerName: string, payload: any): Promise<void>;
    asyncIterator<T>(triggers: string | string[]): AsyncIterator<T>;
  }
}