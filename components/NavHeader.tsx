'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthContext } from '@/lib/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import ShouldRender from './ShouldRender'
import { ModeToggle } from './modeToggle'
import { Button } from './ui/button'

const NavHeader: FC = () => {
  const router = useRouter()
  const {
    isLoggedIn,
    user: profileData,
    setIsLoggedIn,
    setUser,
  } = useAuthContext()
  const firstName = profileData?.first_name ?? 'Guest'
  const lastName = profileData?.last_name ?? 'User'
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`

  const handleLogout = () => {
    // Perform logout actions
    setIsLoggedIn(false) // Set isLoggedIn to false
    setUser(null) // Clear user data

    // Redirect to the login page or any other appropriate page
    router.push('/login')
  }

  return (
    // Navigation bar layout
    <nav className="sticky top-0 z-50 w-full flex flex-row gap-5 justify-between items-center p-4 bg-opacity-50 backdrop-blur-md">
      {/* Brand logo */}
      <Image
        src="./brand-logo.svg"
        className="max-h-[50px]"
        width={150}
        height={50}
        alt="brand-logo"
      />

      {/* Navigation links */}
      <div className="hidden sm:flex gap-5 font-semibold text-gray-600 capitalize">
        <ShouldRender check={isLoggedIn}>
          <Link href="/">Explore</Link>
          <Link href="/blog">My Blogs</Link>
          <Link href="/interactions">Interactions</Link>
        </ShouldRender>
      </div>

      {/* Login button and user dropdown */}
      <div className="flex gap-3 ">
        {/* Login button */}
        {!isLoggedIn ? (
          <Button
            variant={'ghost'}
            onClick={() => router.push('/login')}
            className="rounded-md px-4 py-2 ">
            Login
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              {/* User avatar */}
              <Avatar>
                <AvatarImage src={profileData?.profile_pic || undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            {/* Dropdown menu content */}
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {/* Display user information */}
                <p className="font-semibold">Signed in as</p>
                <p className="font-light cursor-pointer ">
                  {profileData?.email || 'USER'}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Navigation links in the dropdown for small screens */}
              <DropdownMenuItem
                key="Explore"
                className="sm:hidden text-gray-600 capitalize font-semibold">
                <Link href="/">Explore</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                key="Blogs"
                className="sm:hidden text-gray-600 capitalize font-semibold">
                <Link href="/blog">My Blogs</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                key="Interactions"
                className="sm:hidden text-gray-600 capitalize font-semibold">
                <Link href="/interactions">Interactions</Link>
              </DropdownMenuItem>

              {/* Other dropdown menu items */}
              <DropdownMenuItem key="settings">Settings</DropdownMenuItem>
              <DropdownMenuItem key="help_and_feedback">
                Help & Feedback
              </DropdownMenuItem>
              <DropdownMenuItem
                key="logout"
                className="text-red-500"
                onClick={handleLogout}>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Dark mode toggle */}
        <ModeToggle />
      </div>
    </nav>
  )
}

export default NavHeader
