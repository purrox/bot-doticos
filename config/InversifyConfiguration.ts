import 'reflect-metadata';
import { Container } from 'inversify';
import { MongoConfiguration } from './MongoConfiguration';
import RedisConfiguration from './RedisConfiguration';
import {UsersService} from "../services/UsersService";
import {DiscordService} from "../services/DiscordService";
import {GamesServices} from "../services/GamesServices";

const container: Container = new Container();

container.bind<MongoConfiguration>(MongoConfiguration).toSelf().inSingletonScope();
container.bind<RedisConfiguration>(RedisConfiguration).toSelf().inSingletonScope();
container.bind<UsersService>(UsersService).toSelf().inTransientScope();
container.bind<GamesServices>(GamesServices).toSelf().inTransientScope()
container.bind<DiscordService>(DiscordService).to(DiscordService);

export default container;