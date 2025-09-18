// utils/confirmAndDelete.ts
import Swal from 'sweetalert2';
import axios from 'axios';

interface DeleteOptions {
    url: string;                // API endpoint to call
    name?: string;              // Name to show in alert
    onSuccess?: () => void;     // Optional callback after successful deletion
}

export const confirmAndDelete = async ({ url, name, onSuccess }: DeleteOptions) => {
    const result = await Swal.fire({
        title: `Are you sure you want to delete ${name || 'this item'}?`,
        html: 'This action is <b>irreversible</b>.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
        try {
            await axios.delete(url);
            if (onSuccess) onSuccess(); // e.g., remove from grid
            Swal.fire('Deleted!', `${name || 'Item'} has been removed.`, 'success');
        } catch (err) {
            console.error(err);
            Swal.fire('Error!', 'Failed to delete.', 'error');
        }
    }
};
