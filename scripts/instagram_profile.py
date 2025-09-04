#!/usr/bin/env python3
"""
Instagram Profile Fetcher using instaloader
Fetches public Instagram profile information
"""

import instaloader
import json
import sys
import os
from typing import Dict, Any, Optional

class InstagramProfileFetcher:
    def __init__(self):
        self.loader = instaloader.Instaloader()
        # Disable download of posts, stories, etc. - we only want profile info
        self.loader.download_posts = False
        self.loader.download_stories = False
        self.loader.download_tagged = False
        
    def get_profile_info(self, username: str) -> Optional[Dict[str, Any]]:
        """
        Fetch Instagram profile information
        
        Args:
            username: Instagram username (without @)
            
        Returns:
            Dictionary containing profile information or None if not found
        """
        try:
            # Remove @ symbol if present
            username = username.replace('@', '').strip()
            
            if not username:
                raise ValueError("Username cannot be empty")
            
            # Get profile
            profile = instaloader.Profile.from_username(self.loader.context, username)
            # Extract profile information

            profile_pic_url = profile.profile_pic_url
            if profile_pic_url:
                # Remove query parameters and add .jpg extension
                profile_pic_url = profile_pic_url.split('?')[0] + '.jpg'
        
            profile_data = {
                'username': profile.username,
                'fullName': profile.full_name or '',
                'followers': profile.followers,
                'following': profile.followees,
                'posts': profile.mediacount,
                'profileImage': profile.profile_pic_url,
                'isPrivate': profile.is_private,
                'isVerified': profile.is_verified,
                'biography': profile.biography or '',
                'externalUrl': profile.external_url or '',
                'businessCategory': profile.business_category_name or '',
                'isBusinessAccount': profile.is_business_account,
            }

            
            return profile_data
            
        except instaloader.exceptions.ProfileNotExistsException:
            raise ValueError(f"Instagram profile '{username}' not found")
        except instaloader.exceptions.ConnectionException:
            raise ValueError("Connection error - please try again later")
        except instaloader.exceptions.PrivateProfileNotFollowedException:
            # Still return basic info for private profiles
            try:
                profile = instaloader.Profile.from_username(self.loader.context, username)
                return {
                    'username': profile.username,
                    'fullName': profile.full_name or '',
                    'followers': 0,  # Private profiles don't show counts
                    'following': 0,
                    'posts': 0,
                    'profileImage': profile.profile_pic_url,
                    'isPrivate': True,
                    'isVerified': profile.is_verified,
                    'biography': '',
                    'externalUrl': '',
                    'businessCategory': '',
                    'isBusinessAccount': False,
                }
            except Exception:
                raise ValueError(f"Cannot access private profile '{username}'")
        except Exception as e:
            raise ValueError(f"Error fetching profile: {str(e)}")

def main():
    """Main function for command line usage"""
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python instagram_profile.py <username>"}))
        sys.exit(1)
    
    username = sys.argv[1]
    fetcher = InstagramProfileFetcher()
    
    try:
        profile_data = fetcher.get_profile_info(username)
        if profile_data:
            print(json.dumps({"success": True, "profile": profile_data}))
        else:
            print(json.dumps({"success": False, "error": "Profile not found"}))
    except ValueError as e:
        print(json.dumps({"success": False, "error": str(e)}))
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Unexpected error: {str(e)}"}))

if __name__ == "__main__":
    main()
