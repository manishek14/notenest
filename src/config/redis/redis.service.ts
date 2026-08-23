import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client : Redis
    
    onModuleInit() {
        this.client = new Redis({
            host : "localhost",
            port : 6379
        })

        this.client.on("connect", () => {
            console.log("redis connected successfully.");
        })
        this.client.on("error", (err) => {
            console.log(`redis error => ${err}`);
        })
    }

    getClient(): Redis {
        return this.client;
    }

    async set(key : string, value : string, ttl? : number) {
        if(ttl) return await this.client.set(key, value, "EX", ttl)
        return await this.client.set(key, value)
    }

    async setex(key: string, seconds: number, value: string) {
        return await this.client.setex(key, seconds, value);
    }

    async get(key : string) {
        return await this.client.get(key)
    }

    async del(key : string) {
        await this.client.del(key)
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }

    async keys(pattern: string): Promise<string[]> {
        return await this.client.keys(pattern);
    }

    onModuleDestroy() {
        if (this.client) {
            this.client.quit()
        }
    }
}
