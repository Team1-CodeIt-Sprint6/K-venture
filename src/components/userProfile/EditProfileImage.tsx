import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';

import PenIcon from '@/assets/icons/icon_pen.svg';
import DefaultProfile from '@/assets/images/profile_default_img.png';
import useFetchData from '@/hooks/useFetchData';
import { updateUserData } from '@/lib/apis/patchApis';
import { postProfileImage } from '@/lib/apis/postApis';
import { getUserData } from '@/lib/apis/userApis';

/**
 * NOTE: 프로필 이미지 입력받는 컴포넌트
 *
 */

export default function EditProfileImage() {
  const queryClient = useQueryClient();
  const [profileImage, setProfileImage] = useState<string>(DefaultProfile.src);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data, isLoading: isQueryLoading } = useFetchData(
    ['userProfile'],
    getUserData,
    {},
  );

  // 프로필 이미지 업데이트 뮤테이션
  const mutation = useMutation({
    mutationFn: async (profileImageUrl: string) => {
      await updateUserData({ profileImageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const presignedUrl = await postProfileImage(file);

        if (presignedUrl) {
          const profileUrl = presignedUrl.split('?')[0];
          setProfileImage(profileUrl);
          mutation.mutate(profileUrl);
        } else {
          console.error('Presigned URL을 생성할 수 없습니다.');
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (data && data.profileImageUrl) {
      setProfileImage(data.profileImageUrl);
    }
  }, [data]);

  return (
    <form className="relative m-auto mb-6 h-40 w-40">
      <div className="relative h-40 w-40 overflow-hidden rounded-full shadow-lg">
        <Image
          src={profileImage}
          alt={`${data?.nickname}의 프로필 이미지`}
          fill
          objectFit="cover"
        />
      </div>

      <label htmlFor="uploadProfileImage">
        <span className="absolute bottom-0 right-0 z-10 cursor-pointer rounded-full bg-kv-primary-blue p-2.5 transition-all hover:scale-110">
          <PenIcon />
        </span>
      </label>

      <input
        id="uploadProfileImage"
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={handleImageChange}
      />

      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-50">
          로딩중...
        </div>
      )}
    </form>
  );
}
