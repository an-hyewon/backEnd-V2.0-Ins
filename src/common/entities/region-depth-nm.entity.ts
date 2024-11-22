import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'tb_region_depth_nm',
  comment: '법정동코드 내역 (240208)',
})
@Unique(['sigunguCd', 'bjdongCd'])
export class RegionDepthNm {
  @PrimaryGeneratedColumn({
    name: 'seq_no',
    comment: 'ID',
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'sigungu_cd',
    comment: '시군구 코드',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  sigunguCd: string;

  @Column({
    name: 'bjdong_cd',
    comment: '법정동 코드',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  bjdongCd: string;

  @Column({
    name: 'region_first_depth_nm',
    comment: '시도명',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  regionFirstDepthNm: string;

  @Column({
    name: 'region_second_depth_nm',
    comment: '시군구명',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  regionSecondDepthNm: string;

  @Column({
    name: 'region_third_depth_nm',
    comment: '읍면동명',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  regionThirdDepthNm: string;

  @Column({
    name: 'region_fourth_depth_nm',
    comment: '동리명',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  regionFourthDepthNm: string;
}
