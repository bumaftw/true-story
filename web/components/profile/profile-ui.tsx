'use client';

import { useState } from 'react';

export type ProfileData = {
  username: string | null;
  avatar: string | null;
  xLink: string | null;
};

export type ProfileCardProps = ProfileData & {
  onSave: (data: {
    username: string | null;
    avatar: string | null;
    xLink: string | null;
  }) => void;
};

export function ProfileCard({
  username: initialUsername,
  avatar: initialAvatar,
  xLink: initialXLink,
  onSave,
}: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(initialUsername);
  const [avatar, setAvatarUrl] = useState(initialAvatar);
  const [xLink, setXLink] = useState(initialXLink);

  const handleSave = () => {
    onSave({ username, avatar, xLink });
    setIsEditing(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="card bg-gray-100 shadow-xl p-4 flex justify-between items-center"
      style={{ minHeight: '144px', maxHeight: '144px' }}
    >
      <div className="flex items-center justify-between w-full h-full">
        {/* Avatar Section */}
        <div className="avatar flex items-center justify-center">
          <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center">
            <img src={avatar || '/default-avatar.webp'} alt="User Avatar" />
          </div>
        </div>

        {/* Edit Section */}
        {isEditing ? (
          <div
            className="flex-grow flex flex-col justify-center space-y-2 px-4"
            style={{ height: '112px' }}
          >
            <input
              type="text"
              className="input input-sm input-bordered w-full"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={{ height: '32px' }}
            />
            <input
              type="url"
              className="input input-sm input-bordered w-full"
              value={xLink || ''}
              onChange={(e) => setXLink(e.target.value)}
              placeholder="X.com Link"
              style={{ height: '32px' }}
            />
            <input
              type="file"
              accept="image/*"
              className="input input-sm input-bordered w-full"
              onChange={handleAvatarChange}
              style={{ height: '32px', lineHeight: '1.5rem' }}
            />
          </div>
        ) : (
          // View Mode
          <div
            className="flex-grow flex flex-col justify-center px-4"
            style={{ height: '112px' }}
          >
            <h2 className="text-xl font-semibold truncate leading-tight">
              {username || 'Anonymous'}
            </h2>
            <p className="truncate leading-tight">
              {xLink ? (
                <a
                  href={xLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {xLink}
                </a>
              ) : (
                <span className="text-gray-500">No X.com link</span>
              )}
            </p>
          </div>
        )}

        {/* Button Section */}
        <div className="ml-4 flex items-center justify-center">
          {isEditing ? (
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
