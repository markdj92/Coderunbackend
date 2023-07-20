import { FaFilter } from 'react-icons/fa';
import { TbRefresh } from 'react-icons/tb';
import styled from 'styled-components';

import RoomCard from '../RoomCard';

import Arrows from './Arrows';

import { RoomInformation } from '@/types/room';

const RoomList = () => {
  const roomInfos: RoomInformation[] = [
    {
      title: '정글 스터디 하실 분',
      member_count: 3,
      max_members: 4,
      level: 3,
      mode: 'STUDY',
      status: 'PUBLIC',
      ready: true,
      create_time: '2021-10-10T12:00:00',
      socket_id: '1234',
      master: '방장 이름',
    },
    {
      title: '4:4 팀전 플레이상만',
      member_count: 3,
      max_members: 8,
      level: 5,
      mode: 'COOPERATIVE',
      status: 'PUBLIC',
      ready: true,
      create_time: '2021-10-10T12:00:00',
      socket_id: '1234',
      master: '노원주',
    },
    {
      title: '초보만 오세요',
      member_count: 6,
      max_members: 8,
      level: 1,
      mode: 'COOPERATIVE',
      status: 'PUBLIC',
      ready: false,
      create_time: '2021-10-10T12:00:00',
      socket_id: '1234',
      master: '조현오',
    },
    {
      title: '박준익 들어와라',
      member_count: 1,
      max_members: 2,
      level: 2,
      mode: 'STUDY',
      status: 'PRIVATE',
      ready: true,
      create_time: '2021-10-10T12:00:00',
      socket_id: '1234',
      master: '조수빈',
    },
    {
      title: '골드이상 나가세요',
      member_count: 3,
      max_members: 7,
      level: 2,
      mode: 'STUDY',
      status: 'PUBLIC',
      ready: true,
      create_time: '2021-10-10T12:00:00',
      socket_id: '1234',
      master: '이시형',
    },
    {
      title: '그린반 다 모여라',
      member_count: 8,
      max_members: 8,
      level: 5,
      mode: 'STUDY',
      status: 'PUBLIC',
      ready: false,
      create_time: '2021-10-10T12:00:00',
      socket_id: '1234',
      master: '조현오',
    },
    {
      title: '크래프톤 코테 준비방',
      member_count: 5,
      max_members: 6,
      level: 3,
      mode: 'STUDY',
      status: 'PUBLIC',
      ready: false,
      create_time: '2021-10-10T12:00:00',
      socket_id: '1234',
      master: '이민지',
    },
    {
      title: '',
      member_count: 2,
      max_members: 4,
      level: 2,
      mode: 'COOPERATIVE',
      status: 'PRIVATE',
      ready: false,
      create_time: '',
      socket_id: '',
      master: '',
    },
  ];
  return (
    <Container>
      <HeaderFrame>
        <HeaderLeftBox>
          <FaFilter size={'1.5rem'} style={{ marginRight: '0.5rem' }} />
          <div>난이도 설정</div>
        </HeaderLeftBox>
        <Arrows size={'2rem'} />
        <HeaderRightBox>
          <button>
            <TbRefresh size={'2rem'} />
          </button>
        </HeaderRightBox>
      </HeaderFrame>
      <ContentFrame>
        {roomInfos.map((info, index) => (
          <RoomCard key={index} roomInfo={info} />
        ))}
      </ContentFrame>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1.5rem;
`;

const HeaderFrame = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10%;
  position: relative;
`;

const HeaderLeftBox = styled.div`
  display: flex;
  position: absolute;
  left: 1rem;
`;

const HeaderRightBox = styled.div`
  display: flex;
  position: absolute;
  right: 1rem;
  button {
    transition: all 0.3s ease;
    &:hover {
      rotate: 90deg;
    }
  }
`;

const ContentFrame = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default RoomList;
