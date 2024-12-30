// Avatar.tsx


import React from 'react';

interface AvatarProps {
    size: number;
    src: string;  // 'src' should be required if you expect an image URL.
}

const Avatar: React.FC<AvatarProps> = ({ size, src }) => {
    return (
        <img
            src={src}
            alt="Avatar"
            style={{ width: size, height: size, borderRadius: '50%' }}
        />
    );
};

export default Avatar;
