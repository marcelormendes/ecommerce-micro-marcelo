import { Client } from '@elastic/elasticsearch';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ESClientSingle {

    constructor(private readonly configService: ConfigService) { }
    buildESclient() {
        return new Client({
            node: this.configService.get<string>('elastic_search_node'),
        })
    }

}