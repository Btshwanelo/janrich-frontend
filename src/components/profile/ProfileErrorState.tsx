import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/base/buttons/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/untitled-card';
import { PROFILE_MESSAGES } from '@/constants/profile';

interface ProfileErrorStateProps {
  onRetry?: () => void;
}

export const ProfileErrorState: React.FC<ProfileErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="flex items-center justify-center h-full mt-16 lg:mt-0">
      <Card className="max-w-md mx-auto shadow-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {PROFILE_MESSAGES.ERROR}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600 mb-6">
            {PROFILE_MESSAGES.ERROR_DESCRIPTION}
          </p>
          {onRetry && (
            <Button
              color="primary"
              size="md"
              className="gap-2"
              iconLeading={<RefreshCw className="w-4 h-4" />}
              onClick={onRetry}
            >
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
