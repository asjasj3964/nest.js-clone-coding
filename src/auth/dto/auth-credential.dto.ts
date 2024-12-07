import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  username: string;
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9!]+$/, {
    message: '패스워드는 영어, 숫자, ! 기호만 가능합니다.',
  }) // 영어, 숫자 기호(!)만 가능한 유효성 체크
  password: string;
}
