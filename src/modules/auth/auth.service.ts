import * as bcrypt from "bcrypt";
import { LoginRequestType, InsertUserType } from "./auth.schema";
import { UserRepository } from "../user/user.repository";
import { InvalidLoginError } from "@api/errors/errors";
import { SharedRepository } from "../shared/shared.repository";
import { schema } from "@api/plugins/db";

export class AuthService extends SharedRepository {
  private userRepository: UserRepository;
  constructor(userRp?: UserRepository) {
    super();
    this.userRepository = userRp ?? new UserRepository();
  }

  async register(usuario: InsertUserType) {
    usuario = await this.registerSetup(usuario);
    const [user] = await this.db
      .insert(schema.usuario)
      .values(usuario)
      .returning();
    return user;
  }

  async registerSetup(usuario: InsertUserType) {
    usuario.password = await this.hashPassword(usuario.password);
    return usuario;
  }
  async login(data: LoginRequestType) {
    console.log(await this.hashPassword("string"))
    const usuario = await this.userRepository.findByEmail(data.email);

    if (!usuario) {
      throw new InvalidLoginError();
    }

    const equal = await this.passwordsMatch(data.password, usuario.password);
    if (!equal) {
      throw new InvalidLoginError();
    }
    usuario.password = "";
    return { usuario };
  }
  async passwordsMatch(password: string, hash: string) {
    const equal = await bcrypt.compare(password, hash);
    return equal;
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 1);
  }
}
