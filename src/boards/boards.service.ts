import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { Board, BoardStatus } from './board-status.enum';
// import { v1 as uuid } from 'uuid';
// import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}
  // private boards: Board[] = []; // private - 다른 컴포넌트에서 boards 배열 값을 수정하지 않게 하기 위함
  async getAllBoards(user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');
    query.where('board.userId = :userId', { userId: user.id });
    const boards = await query.getMany();
    return boards;
  }
  // getAllBoards(): Board[] {
  //   return this.boards;
  // }
  createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto, user);
  }
  // createBoard(createBoardDto: CreateBoardDto) {
  //   const { title, description } = createBoardDto;
  //   const board: Board = {
  //     id: uuid(), // unique한 값을 ID로 준다.
  //     title, //title: title,
  //     description, //description: description,
  //     status: BoardStatus.PUBLIC,
  //   };
  //   this.boards.push(board);
  //   return board; // 생성된 게시물에 대한 정보 전달
  // }
  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne(id); // TypeORM 0.3 이상의 경우 findOneBy({ id })
    if (!found) {
      throw new NotFoundException(
        `해당 id(${id})를 가진 게시물을 찾을 수 없습니다.`,
      );
    }
    return found;
  }
  // getBoardById(id: string): Board {
  //   const found = this.boards.find((board) => board.id === id);
  //   if (!found) {
  //     throw new NotFoundException(
  //       `해당 ID (${id})의 게시물을 찾을 수 없습니다.`,
  //     );
  //   }
  //   return found;
  // }
  async deleteBoard(id: number, user: User): Promise<void> {
    const result = await this.boardRepository.delete({ id, user }); // id: id, user: user
    if (result.affected === 0) {
      throw new NotFoundException(
        `해당 ID (${id})의 게시물을 찾을 수 없습니다.`,
      );
    }
    console.log('result', result);
  }
  // deleteBoard(id: string): void {
  //   const found = this.getBoardById(id);
  //   this.boards = this.boards.filter((board) => board.id !== found.id);
  // }
  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;
    await this.boardRepository.save(board);
    return board;
  }
  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //   const board = this.getBoardById(id);
  //   board.status = status;
  //   return board;
  // }
}
