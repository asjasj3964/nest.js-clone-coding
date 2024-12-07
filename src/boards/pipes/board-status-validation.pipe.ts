import { BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from '../board-status.enum';

export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];
  transform(value: any) {
    // value: 요청에서 전달된 데이터, metadata: 요청 데이터에 대한 메타데이터를 포함한 객체
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value}는 status 값이 될 수 없습니다.`);
    }
    return value;
  }
  private isStatusValid(status: any) {
    const index = this.StatusOptions.indexOf(status);
    return index !== -1;
  }
}
