import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'chat_room' })
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  roomId: string

  @Column({ nullable: false })
  departureTime: string

  @Column({ nullable: false })
  departurePoint: string

  @Column({ nullable: false })
  arrivalPoint: string

  @Column({ default: true })
  isLive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateddAt: Date

  //join
  @Column()
  userId: string

  @Column()
  nickname: string
}