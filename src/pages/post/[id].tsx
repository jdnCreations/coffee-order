import NextError from 'next/error';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '~/pages/_app';
import { RouterOutput, trpc } from '~/utils/trpc';

type PostByIdOutput = RouterOutput['post']['byId'];

function PostItem(props: { post: PostByIdOutput }) {
  const id = useRouter().query.id as string;
  const utils = trpc.useContext();
  const { post } = props;

  const commentsQuery = trpc.comment.byPostId.useQuery({ postId: id });

  const addComment = trpc.comment.create.useMutation({
    onSuccess: () => {
      utils.comment.invalidate();
    },
  });

  return (
    <>
      <h1>{post.title}</h1>
      <em>Created {post.createdAt.toLocaleDateString('en-us')}</em>

      <p>{post.text}</p>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(post, null, 4)}</pre>

      <h3>Comments</h3>
      {commentsQuery.data?.map((comment) => (
        <div key={comment.id} className="border border-black px-8">
          <h4>{comment.name}</h4>
          <p>{comment.text}</p>
        </div>
      ))}

      <h3>Add a Comment</h3>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const $name: HTMLInputElement = (event as any).target.elements.name;
          const $text: HTMLInputElement = (event as any).target.elements.text;
          addComment.mutate({
            postId: id,
            name: $name.value,
            text: $text.value,
          });

          $name.value = '';
          $text.value = '';
        }}
      >
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" />
        <label htmlFor="text">Text</label>
        <input type="text" name="text" id="text" />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

const PostViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const postQuery = trpc.post.byId.useQuery({ id });

  // load comments for this post

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (postQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = postQuery;
  return <PostItem post={data} />;
};

export default PostViewPage;
