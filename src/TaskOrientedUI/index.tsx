import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Pencil,
  Trash,
  StickyNote,
  Sparkles,
  Tag,
  Tags,
  Plus,
  BookOpen,
  ArrowLeft,
  Trash2,
  AlertTriangle,
  CheckCircle,
  X,
} from 'lucide-react';

// --- 型定義 ---
interface TagType {
  id: string;
  name: string;
}

interface BookType {
  id: number;
  title: string;
  author: string;
  isbn: string;
  tags: string[];
  review: string;
  purchaseDate: string;
  cover: string;
}

type ScreenName =
  | 'home'
  | 'addBookForm'
  | 'bookList'
  | 'editBookForm'
  | 'reviewBookForm'
  | 'viewBookForm'
  | 'deleteBookConfirm'
  | 'recentBooks'
  | 'tagList'
  | 'addTagForm'
  | 'editTagForm';

type ModeType = 'search' | 'edit' | 'delete' | 'review';

type ToastType = {
  message: string;
  visible: boolean;
};

interface ScreenProps {
  book?: BookType;
  tag?: TagType;
  mode?: ModeType;
}

interface TileType {
  id: number;
  title: string;
  icon: typeof Plus; // LucideIconコンポーネント型
  color: string;
  bg: string;
  description: string;
  screen: ScreenName;
  mode?: ModeType;
}

// --- モックデータ ---
const MOCK_TAGS: TagType[] = [
  { id: 't1', name: 'お気に入り' },
  { id: 't2', name: 'SF' },
  { id: 't3', name: '未読' },
  { id: 't4', name: '技術書' },
  { id: 't5', name: 'マンガ' },
];

const MOCK_ALL_BOOKS: BookType[] = [
  {
    id: 101,
    title: '斉即校の看柏湖',
    author: '大場航平',
    isbn: '978-4-00-111111-1',
    tags: ['t1', 't3'],
    review: 'まだ読んでない。表紙がきれい。',
    purchaseDate: '2025-11-01', // 最近のデータ
    cover:
      'https://www.dropbox.com/scl/fi/ecxrgvx5zubanybo0ov9d/1.png?rlkey=enjulbl8lb9gr9nhmkp4nscg9&st=akcha49t&raw=1',
  },
  {
    id: 102,
    title: '世界で一を一這火い筋',
    author: '川口大輔',
    isbn: '978-4-00-222222-2',
    tags: ['t2'],
    review: '面白かった。',
    purchaseDate: '2025-10-15', // 最近のデータ
    cover:
      'https://www.dropbox.com/scl/fi/2n5501ytxsv1yuppoah88/2.png?rlkey=wv9g95qali4l69jaikik1c1gb&st=i961cgxd&raw=1',
  },
  {
    id: 103,
    title: '感染症の部うな苗',
    author: '劉慈欣',
    isbn: '978-4-00-333333-3',
    tags: ['t2', 't1'],
    review: '三部作の一作目。圧倒的スケール。',
    purchaseDate: '2024-11-08',
    cover:
      'https://www.dropbox.com/scl/fi/yki8me38ftjskc5p9r3xk/3.png?rlkey=v56dkn7zsqnxt167bg7vyru3l&st=5ihohe6u&raw=1',
  },
  {
    id: 104,
    title: '人類は星を愛する必要',
    author: '巴忠孝',
    isbn: '978-4-00-444444-4',
    tags: ['t4'],
    review: '',
    purchaseDate: '2024-05-15',
    cover:
      'https://www.dropbox.com/scl/fi/esmrg6k9gs306ks8o9rkr/4.png?rlkey=sn16mxcyehwivxsr062flty8p&st=04dz0gjf&raw=1',
  },
  // ... 他のデータは省略
];

// ホーム画面のタイルデータ
const TILE_DATA: TileType[] = [
  {
    id: 1,
    title: '本を登録する',
    icon: Plus,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    description: 'タイトルやISBNで本を登録する',
    screen: 'addBookForm' as const,
  },
  {
    id: 2,
    title: '本を探す',
    icon: Search,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    description: '著者名や出版年など詳しい条件で探す',
    screen: 'bookList' as const,
    mode: 'search' as const,
  },
  {
    id: 3,
    title: '本を修正する',
    icon: Pencil,
    color: 'text-green-500',
    bg: 'bg-green-50',
    description: 'タイトルや著者名を編集する',
    screen: 'bookList',
    mode: 'edit',
  },
  {
    id: 4,
    title: '本を削除する',
    icon: Trash,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    description: '登録した本を削除する',
    screen: 'bookList',
    mode: 'delete',
  },
  {
    id: 5,
    title: '感想文を書く',
    icon: StickyNote,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    description: '読んだ本の感想を記録する',
    screen: 'bookList',
    mode: 'review',
  },
  {
    id: 6,
    title: '最近登録した本を見る',
    icon: Sparkles,
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    description: '最近登録した本の一覧を見る',
    screen: 'recentBooks',
  },
  {
    id: 7,
    title: 'タグを見る',
    icon: Tags,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    description: '登録した本のタグを管理する',
    screen: 'tagList',
  },
  {
    id: 8,
    title: 'タグを作る',
    icon: Tag,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
    description: '新しいタグを作成する',
    screen: 'addTagForm',
  },
];

// --- 共通コンポーネント ---

// トーストコンポーネント
interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3秒後に自動で閉じる
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top duration-300">
      <div className="bg-green-50 rounded-lg shadow-xl border border-green-200 p-4 flex items-center space-x-3 min-w-[320px]">
        <div className="shrink-0 bg-green-100 rounded-full p-1">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-green-800 font-medium grow">{message}</p>
        <button
          onClick={onClose}
          className="shrink-0 text-green-600 hover:text-green-700 transition-colors p-1 hover:bg-green-100 rounded-full"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// ホーム画面用ヘッダー
const HomeHeader: React.FC = () => (
  <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-3 group">
        <div className="bg-blue-600 p-2 rounded-lg shadow-md">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">
            自宅本棚管理アプリ
          </h1>
          <p className="text-xs text-gray-500 hidden md:block -mt-1">
            My Personal Library
          </p>
        </div>
      </div>
    </div>
  </header>
);

// サブ画面用ヘッダー
interface PageHeaderProps {
  title: string;
  onBack: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack }) => (
  <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">
          {title}
        </h1>
      </div>
    </div>
  </header>
);

// フッター (変更なし)
const Footer = () => (
  <footer className="bg-white border-t border-gray-200 py-6 mt-auto z-20">
    <div className="container mx-auto px-4 text-center text-gray-500">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} honokiyuto. All rights reserved.
      </p>
    </div>
  </footer>
);

// 汎用ページラッパー
interface PageProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ title, onBack, children }) => (
  <div className="flex flex-col min-h-screen">
    <PageHeader title={title} onBack={onBack} />
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">{children}</div>
    </main>
    <Footer />
  </div>
);

// --- 画面コンポーネント ---

// ホーム画面 (タイル)
interface HomeScreenProps {
  navigateTo: (screenName: ScreenName, props?: ScreenProps) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigateTo }) => (
  <div className="flex flex-col min-h-screen">
    <HomeHeader />
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {TILE_DATA.map((tile) => (
            <div key={tile.id} className="w-full h-full max-w-sm">
              <button
                onClick={() => navigateTo(tile.screen, { mode: tile.mode })}
                className="group flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center border border-gray-100 hover:border-gray-200 h-full w-full"
              >
                <div
                  className={`p-5 rounded-full ${tile.bg} mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <tile.icon className={`w-10 h-10 ${tile.color}`} />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {tile.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {tile.description}
                </p>
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

// 本のリスト項目 (リスト画面用)
interface BookListItemProps {
  book: BookType;
  onClick: () => void;
  actionIcon?: typeof Plus;
  onAction?: () => void;
}

const BookListItem: React.FC<BookListItemProps> = ({
  book,
  onClick,
  actionIcon: ActionIcon,
  onAction,
}) => (
  <li className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
    <img
      src={book.cover}
      alt={book.title}
      className="w-12 h-16 object-cover rounded shadow-sm flex-shrink-0 mr-4"
    />
    <div className="flex-grow overflow-hidden" onClick={onClick}>
      <p className="font-semibold text-gray-800 truncate">{book.title}</p>
      <p className="text-sm text-gray-500 truncate">{book.author}</p>
    </div>
    {ActionIcon && (
      <button
        onClick={onAction}
        className="p-2 ml-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ActionIcon size={18} />
      </button>
    )}
  </li>
);

// 本の一覧画面 (修正/感想/削除/検索)
interface BookListScreenProps {
  navigateTo: (screenName: ScreenName, props?: ScreenProps) => void;
  mode?: ModeType;
}

const BookListScreen: React.FC<BookListScreenProps> = ({
  navigateTo,
  mode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = useMemo(() => {
    return MOCK_ALL_BOOKS.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const screenConfig = {
    edit: {
      title: '本を修正する',
      actionIcon: Pencil,
      onItemClick: (book: BookType) => navigateTo('editBookForm', { book }),
    },
    review: {
      title: '感想文を書く',
      actionIcon: StickyNote,
      onItemClick: (book: BookType) => navigateTo('reviewBookForm', { book }),
    },
    delete: {
      title: '本を削除する',
      actionIcon: Trash,
      onItemClick: (book: BookType) =>
        navigateTo('deleteBookConfirm', { book }),
    },
    search: {
      title: '本を探す',
      actionIcon: null, // クリックで詳細(編集)へ
      onItemClick: (book: BookType) => navigateTo('viewBookForm', { book }),
    },
  }[mode || 'search'];

  return (
    <Page title={screenConfig.title} onBack={() => navigateTo('home')}>
      <div className="space-y-6">
        {/* 検索バー */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-base rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            placeholder="タイトルや著者名で検索..."
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* 本のリスト */}
        <ul className="space-y-4">
          {filteredBooks.map((book) => (
            <BookListItem
              key={book.id}
              book={book}
              onClick={() => screenConfig.onItemClick(book)}
              actionIcon={screenConfig.actionIcon || undefined}
              onAction={() => screenConfig.onItemClick(book)}
            />
          ))}
        </ul>
      </div>
    </Page>
  );
};

// 本のフォーム (内部コンポーネント)
interface BookFormProps {
  bookToEdit?: BookType;
  isReviewOnly?: boolean;
  isViewOnly?: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({
  bookToEdit,
  isReviewOnly = false,
  isViewOnly = false,
  onSave,
  onCancel,
}) => {
  const isEditMode = !!bookToEdit;
  const [selectedTags, setSelectedTags] = useState<string[]>(
    isEditMode ? bookToEdit.tags || [] : []
  );

  const handleTagChange = (tagId: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId)
        ? prevTags.filter((id) => id !== tagId)
        : [...prevTags, tagId]
    );
  };

  const isReadOnly = isReviewOnly || isViewOnly; // 読み取り専用の共通フラグ

  const readOnlyProps = isReadOnly
    ? {
        readOnly: true,
        className:
          'w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 outline-none',
      }
    : {
        className:
          'w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none',
      };

  const disabledProps = isReadOnly
    ? {
        disabled: true,
        className:
          'w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 outline-none',
      }
    : {
        className:
          'w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none',
      };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 overflow-y-auto flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左カラム：書影エリア */}
          <div className="flex flex-col items-center justify-start">
            {isEditMode && bookToEdit.cover ? (
              <div className="w-full aspect-[7/10] rounded-lg overflow-hidden shadow-md relative group">
                <img
                  src={bookToEdit.cover}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                {!isReadOnly && (
                  <div className="absolute inset-0 bg-black bg-transparent group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-full font-medium text-sm shadow-sm hover:bg-gray-100 transition-all">
                      画像を変更
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`w-full aspect-[7/10] border-2 border-dashed rounded-lg flex flex-col items-center justify-center ${
                  isReadOnly
                    ? 'bg-gray-100 border-gray-200'
                    : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-blue-400 transition-colors cursor-pointer'
                }`}
              >
                <BookOpen size={48} className="mb-2 opacity-50 text-gray-400" />
                {!isReadOnly && (
                  <>
                    <span className="text-sm font-medium text-gray-500">
                      書影をアップロード
                    </span>
                    <span className="text-xs mt-1 text-gray-400">
                      またはドラッグ＆ドロップ
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 右カラム：入力フォーム */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue={isEditMode ? bookToEdit.title : ''}
                {...readOnlyProps}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                著者名
              </label>
              <input
                type="text"
                defaultValue={isEditMode ? bookToEdit.author : ''}
                {...readOnlyProps}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  defaultValue={isEditMode ? bookToEdit.isbn || '' : ''}
                  {...readOnlyProps}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  購入日
                </label>
                <input
                  type="date"
                  defaultValue={isEditMode ? bookToEdit.purchaseDate || '' : ''}
                  {...disabledProps}
                />
              </div>
            </div>
            {/* タグ選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグ選択
              </label>
              <div
                className={`max-h-28 overflow-y-auto border rounded-lg p-3 ${
                  isReadOnly
                    ? 'bg-gray-100 border-gray-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MOCK_TAGS.map((tag) => (
                    <label
                      key={tag.id}
                      className={`flex items-center space-x-2 p-2 rounded-md ${
                        isReadOnly
                          ? 'cursor-default'
                          : 'hover:bg-gray-100 cursor-pointer'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => handleTagChange(tag.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                        disabled={isReadOnly}
                      />
                      <span
                        className={`text-sm ${
                          isReadOnly ? 'text-gray-500' : 'text-gray-700'
                        }`}
                      >
                        {tag.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 感想文 (常に下部) */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            感想文
          </label>
          <textarea
            defaultValue={isEditMode ? bookToEdit.review || '' : ''}
            className={`w-full px-3 py-2 rounded-lg border outline-none h-32 resize-none ${
              isReviewOnly
                ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                : isViewOnly
                  ? 'border-gray-200 bg-gray-100 text-gray-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder={isReadOnly ? '' : '感想やメモを入力...'}
            readOnly={isViewOnly}
          ></textarea>
        </div>
      </div>

      {/* フッター */}
      <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end items-center sticky bottom-0 z-10">
        {/* 削除ボタンがあったdivは削除しました。
          親要素のflexを justify-between から justify-end に変更しました。
        */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            {isViewOnly ? '閉じる' : 'キャンセル'}
          </button>
          {!isViewOnly && (
            <button
              onClick={onSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all"
            >
              {isEditMode ? '更新する' : '登録する'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// 本の登録/編集画面
interface BookFormScreenProps {
  navigateTo: (screenName: ScreenName, props?: ScreenProps) => void;
  book?: BookType;
  showToast: (message: string) => void;
}

const BookFormScreen: React.FC<BookFormScreenProps> = ({
  navigateTo,
  book,
  showToast,
}) => {
  const isEditMode = !!book;
  const title = isEditMode ? '図書情報の編集' : '図書の新規登録';
  return (
    <Page title={title} onBack={() => navigateTo('home')}>
      <BookForm
        bookToEdit={book}
        isReviewOnly={false}
        isViewOnly={false}
        onSave={() => {
          showToast(
            isEditMode ? '図書情報を更新しました' : '図書を登録しました'
          );
          navigateTo('home');
        }}
        onCancel={() => navigateTo('home')}
        /* onDeleteプロパティを削除しました */
      />
    </Page>
  );
};

// 感想文編集画面
interface BookReviewScreenProps {
  navigateTo: (screenName: ScreenName, props?: ScreenProps) => void;
  book: BookType;
  showToast: (message: string) => void;
}

const BookReviewScreen: React.FC<BookReviewScreenProps> = ({
  navigateTo,
  book,
  showToast,
}) => (
  <Page title="感想文の編集" onBack={() => navigateTo('home')}>
    <BookForm
      bookToEdit={book}
      isReviewOnly={true}
      isViewOnly={false}
      onSave={() => {
        showToast('感想文を更新しました');
        navigateTo('home');
      }}
      onCancel={() => navigateTo('home')}
    />
  </Page>
);

// ★ 新規追加: 本の詳細表示画面 (読み取り専用)
interface BookViewScreenProps {
  navigateTo: (screenName: ScreenName, props?: ScreenProps) => void;
  book: BookType;
}

const BookViewScreen: React.FC<BookViewScreenProps> = ({
  navigateTo,
  book,
}) => (
  <Page
    title="図書の詳細"
    onBack={() => navigateTo('bookList', { mode: 'search' })}
  >
    <BookForm
      bookToEdit={book}
      isReviewOnly={false}
      isViewOnly={true}
      onSave={() => {}} // 呼ばれない
      onCancel={() => navigateTo('bookList', { mode: 'search' })}
    />
  </Page>
);

// 本削除確認画面
interface DeleteConfirmScreenProps {
  navigateTo: (screenName: ScreenName, props?: ScreenProps) => void;
  book: BookType;
  showToast: (message: string) => void;
}

const DeleteConfirmScreen: React.FC<DeleteConfirmScreenProps> = ({
  navigateTo,
  book,
  showToast,
}) => (
  <Page
    title="削除の確認"
    onBack={() => navigateTo('bookList', { mode: 'delete' })}
  >
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden border border-gray-100">
      <div className="p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          図書を削除しますか？
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          「<span className="font-medium text-gray-700">{book.title}</span>」
          を削除しようとしています。この操作は取り消せません。
        </p>
        <div className="flex space-x-3 justify-center">
          <button
            onClick={() => navigateTo('bookList', { mode: 'delete' })}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors w-1/2"
          >
            キャンセル
          </button>
          <button
            onClick={() => {
              showToast('図書を削除しました');
              navigateTo('home');
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all w-1/2"
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  </Page>
);

// 最近登録した本
interface RecentBooksScreenProps {
  navigateTo: (screenName: ScreenName, props?: ScreenProps) => void;
}

const RecentBooksScreen: React.FC<RecentBooksScreenProps> = ({
  navigateTo,
}) => {
  const recentBooks = useMemo(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return MOCK_ALL_BOOKS.filter(
      (book) => new Date(book.purchaseDate!) >= oneMonthAgo
    ).sort(
      (a, b) =>
        new Date(b.purchaseDate!).getTime() -
        new Date(a.purchaseDate!).getTime()
    );
  }, []);

  return (
    <Page title="最近登録した本" onBack={() => navigateTo('home')}>
      <ul className="space-y-4">
        {recentBooks.map((book) => (
          <BookListItem
            key={book.id}
            book={book}
            onClick={() => navigateTo('editBookForm', { book })}
            actionIcon={Pencil}
            onAction={() => navigateTo('editBookForm', { book })}
          />
        ))}
        {recentBooks.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            ここ1ヶ月以内に登録された本はありません。
          </p>
        )}
      </ul>
    </Page>
  );
};

// タグ一覧画面
interface TagListScreenProps {
  navigateTo: (screenName: ScreenName, props?: ScreenProps) => void;
}

const TagListScreen: React.FC<TagListScreenProps> = ({ navigateTo }) => (
  <Page title="タグ一覧" onBack={() => navigateTo('home')}>
    <ul className="bg-white rounded-lg shadow border border-gray-100 divide-y divide-gray-100">
      {MOCK_TAGS.map((tag) => (
        <li
          key={tag.id}
          className="flex items-center justify-between p-4 group hover:bg-gray-50 cursor-pointer"
          onClick={() => navigateTo('editTagForm', { tag })}
        >
          <div className="flex items-center">
            <Tag className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" />
            <span className="text-gray-700 font-medium group-hover:text-blue-600">
              {tag.name}
            </span>
          </div>
          <Pencil
            size={16}
            className="text-gray-400 group-hover:text-blue-600"
          />
        </li>
      ))}
    </ul>
  </Page>
);

// タグのフォーム画面 (登録/編集)
interface TagFormScreenProps {
  navigateTo: (screenName: ScreenName, props?: ScreenProps) => void;
  tag?: TagType;
  showToast: (message: string) => void;
}

const TagFormScreen: React.FC<TagFormScreenProps> = ({
  navigateTo,
  tag,
  showToast,
}) => {
  const isEditMode = !!tag;
  const title = isEditMode ? 'タグを編集する' : 'タグを作成する';

  return (
    <Page
      title={title}
      onBack={() => navigateTo(isEditMode ? 'tagList' : 'home')}
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タグ名
            </label>
            <input
              type="text"
              defaultValue={isEditMode ? tag.name : ''}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="例: お気に入り"
            />
          </div>

          <div className="pt-4 flex justify-between items-center">
            <div>
              {isEditMode && (
                <button
                  onClick={() => {
                    showToast('タグを削除しました');
                    navigateTo('home');
                  }}
                  className="px-4 py-2 rounded-lg border border-red-300 text-red-600 font-medium hover:bg-red-100 hover:border-red-400 transition-colors flex items-center"
                >
                  <Trash2 size={16} className="mr-1.5" />
                  削除する
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigateTo(isEditMode ? 'tagList' : 'home')}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  showToast(
                    isEditMode ? 'タグを更新しました' : 'タグを作成しました'
                  );
                  navigateTo('home');
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all"
              >
                {isEditMode ? '更新' : '作成'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

// --- メインアプリケーションコンポーネント ---
export default function TaskOrientedUI() {
  const [screen, setScreen] = useState<ScreenName>('home');
  const [screenProps, setScreenProps] = useState<ScreenProps>({}); // 画面に渡すデータ
  const [toast, setToast] = useState<ToastType>({
    message: '',
    visible: false,
  });

  const navigateTo = (screenName: ScreenName, props: ScreenProps = {}) => {
    setScreen(screenName);
    setScreenProps(props);
  };

  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };

  const hideToast = () => {
    setToast({ message: '', visible: false });
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen navigateTo={navigateTo} />;
      case 'bookList':
        return (
          <BookListScreen navigateTo={navigateTo} mode={screenProps.mode} />
        );
      case 'addBookForm':
        return (
          <BookFormScreen
            navigateTo={navigateTo}
            book={undefined}
            showToast={showToast}
          />
        );
      case 'editBookForm':
        return (
          <BookFormScreen
            navigateTo={navigateTo}
            book={screenProps.book}
            showToast={showToast}
          />
        );
      case 'reviewBookForm':
        return screenProps.book ? (
          <BookReviewScreen
            navigateTo={navigateTo}
            book={screenProps.book}
            showToast={showToast}
          />
        ) : null;
      case 'viewBookForm':
        return screenProps.book ? (
          <BookViewScreen navigateTo={navigateTo} book={screenProps.book} />
        ) : null;
      case 'deleteBookConfirm':
        return screenProps.book ? (
          <DeleteConfirmScreen
            navigateTo={navigateTo}
            book={screenProps.book}
            showToast={showToast}
          />
        ) : null;
      case 'recentBooks':
        return <RecentBooksScreen navigateTo={navigateTo} />;
      case 'tagList':
        return <TagListScreen navigateTo={navigateTo} />;
      case 'addTagForm':
        return (
          <TagFormScreen
            navigateTo={navigateTo}
            tag={undefined}
            showToast={showToast}
          />
        );
      case 'editTagForm':
        return (
          <TagFormScreen
            navigateTo={navigateTo}
            tag={screenProps.tag}
            showToast={showToast}
          />
        );
      default:
        return <HomeScreen navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={hideToast}
      />
      {renderScreen()}
    </div>
  );
}
