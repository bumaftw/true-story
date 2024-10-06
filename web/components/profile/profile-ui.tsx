'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { ExplorerLink } from '../cluster/cluster-ui';
import { IconEdit } from '@tabler/icons-react';

export type ProfileData = {
  publicKey: string;
  username?: string | null;
  avatar?: string | null;
  xLink?: string | null;
  bio?: string | null;
};

export type ProfileCardProps = ProfileData & {
  onSave?: (data: ProfileData) => void;
};

export function ProfileCard({
  publicKey,
  username: initialUsername,
  avatar: initialAvatar,
  xLink: initialXLink,
  bio: initialBio,
  onSave,
}: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(initialUsername);
  const [avatar, setAvatarUrl] = useState(initialAvatar);
  const [xLink, setXLink] = useState(initialXLink);
  const [bio, setBio] = useState(initialBio);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = () => {
    if (onSave) {
      onSave({ publicKey, username, avatar, xLink, bio });
    }
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
      style={{ minHeight: '192px', maxHeight: '192px' }}
    >
      <div className="flex items-center justify-between w-full h-full">
        {/* Avatar Section */}
        <div
          className="avatar flex items-center justify-center relative cursor-pointer"
          onClick={() => isEditing && fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center">
            <img src={avatar || '/default-avatar.webp'} alt="User Avatar" />
          </div>
          {isEditing && (
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1">
              <IconEdit size={16} />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
        </div>

        {/* Edit Section */}
        {onSave && isEditing ? (
          <div
            className="flex-grow flex flex-col justify-center space-y-2 px-4"
            style={{ height: '160px' }}
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
            <textarea
              className="input input-sm input-bordered w-full py-2"
              value={bio || ''}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Short bio"
              rows={4}
              style={{
                height: '64px',
                lineHeight: '1rem',
                overflowY: 'auto',
              }}
            />
          </div>
        ) : (
          // View Mode
          <div
            className="flex-grow flex flex-col justify-center px-4"
            style={{ height: '160px' }}
          >
            <h2 className="text-xl font-semibold truncate leading-tight">
              <ExplorerLink
                path={`account/${publicKey}`}
                label={username || 'Anonymous'}
                className="hover:underline"
              />
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
            <div
              className="text-sm text-gray-600 overflow-y-auto"
              style={{ maxHeight: '64px' }}
            >
              {bio || 'No bio available'}
            </div>
          </div>
        )}

        {/* Button Section */}
        {onSave && (
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
        )}
      </div>
    </div>
  );
}

export function ProfileLabel({ author }: { author: ProfileData }) {
  return (
    <div className="flex items-center space-x-4 mx-2">
      <div className="avatar">
        <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img
            src={author.avatar || '/default-avatar.webp'}
            alt="Author Avatar"
          />
        </div>
      </div>
      <div className="text-sm">
        <Link
          className="text-primary hover:underline"
          href={`/profile/${author.publicKey}`}
        >
          {author.username || 'Anonymous'}
        </Link>
      </div>
    </div>
  );
}
