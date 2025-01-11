export default function GalleryMediaItem({ url, onClickMedia }: { url: string, onClickMedia: (url: string) => void }) {
    const isVideo = url.includes('.mp4');

    return (
        <div className="flex justify-center items-center my-4 cursor-pointer"
            onClick={() => onClickMedia(url)}>
            {isVideo ? (
                <video
                    className="w-full max-w-lg aspect-square rounded-lg object-cover"
                    autoPlay
                    muted
                    loop
                >
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <img
                    src={url}
                    alt="Media content"
                    className="w-full max-w-lg aspect-square rounded-lg object-cover"
                />
            )}
        </div>
    );
};