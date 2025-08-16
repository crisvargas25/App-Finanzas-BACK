declare module "amqplib" {
  export interface Connection {
    createChannel(): Promise<Channel>;
    close(): Promise<void>;
  }

  export interface Channel {
    assertExchange(exchange: string, type: string, options?: any): Promise<any>;
    assertQueue(queue: string, options?: any): Promise<any>;
    bindQueue(queue: string, source: string, pattern: string): Promise<any>;
    publish(exchange: string, routingKey: string, content: Buffer, options?: any): boolean;
    // (añade aquí otros métodos que uses, si quieres)
  }

  export function connect(url: string, socketOptions?: any): Promise<Connection>;
}
