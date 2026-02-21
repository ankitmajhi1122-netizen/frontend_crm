import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';

const SkeletonPage: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
      {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rounded" width={200} height={100} />)}
    </Stack>
    <Skeleton variant="rounded" width="100%" height={320} />
  </Box>
);

export default SkeletonPage;
