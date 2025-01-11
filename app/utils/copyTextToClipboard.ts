import Swal from 'sweetalert2';

export async function copyTextToClipboard(text: string | undefined) {
  if (!navigator.clipboard) {
    return;
  }
  try {
    if (text) await navigator.clipboard.writeText(text);
    Swal.fire({
      icon: 'success',
      title: 'Copied!',
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
  }
}
