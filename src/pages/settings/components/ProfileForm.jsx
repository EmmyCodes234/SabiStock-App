import React, { useState, useEffect } from 'react';
import { profileService } from '../../../utils/apiService';
import { notificationHelpers } from '../../../utils/notifications';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';

const ProfileForm = () => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const data = await profileService.getProfile();
                setProfile(data);
            } catch (error) {
                notificationHelpers.error("Failed to load profile.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (field, value) => {
        setProfile(prev => ({...prev, [field]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Remove fields that the user shouldn't update directly
            const { id, updated_at, ...updateData } = profile;
            await profileService.updateProfile(updateData);
            notificationHelpers.success("Profile updated successfully!");
        } catch (error) {
            notificationHelpers.error(`Failed to update profile: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-card border border-border rounded-lg p-6">
                <SkeletonLoader height="2rem" width="40%" className="mb-6" />
                <div className="space-y-4">
                    <SkeletonLoader height="3rem" />
                    <SkeletonLoader height="3rem" />
                    <SkeletonLoader height="3rem" />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg">
            <div className="p-6 border-b border-border">
                <h2 className="font-heading font-semibold text-xl text-foreground">Business Profile</h2>
                <p className="text-sm text-muted-foreground mt-1">This information will appear on your receipts and reports.</p>
            </div>
            <div className="p-6 space-y-4">
                <Input 
                    label="Business Name"
                    value={profile?.business_name || ''}
                    onChange={(e) => handleInputChange('business_name', e.target.value)}
                />
                <Input 
                    label="Business Type"
                    value={profile?.business_type || ''}
                    onChange={(e) => handleInputChange('business_type', e.target.value)}
                />
                <Input 
                    label="Phone Number"
                    value={profile?.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                />
                 <Input 
                    label="Location"
                    value={profile?.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                />
                 <Input 
                    label="Currency"
                    value={profile?.currency || 'NGN'}
                    disabled
                    icon={<Icon name="Lock" size={16} />}
                />
            </div>
            <div className="p-6 border-t border-border flex justify-end">
                <Button type="submit" loading={isSaving} disabled={isSaving}>
                    Save Changes
                </Button>
            </div>
        </form>
    );
};

export default ProfileForm;