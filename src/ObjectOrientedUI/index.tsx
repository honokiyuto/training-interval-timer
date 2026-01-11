import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  BookOpen,
  X,
  Book,
  Plus,
  ArrowDownWideNarrow,
  ArrowDownAZ,
  UserRound,
  LayoutGrid,
  Tags,
  Tag,
  Edit,
  Trash2,
  AlertTriangle,
  Menu,
  Check,
  CheckCircle,
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
    purchaseDate: '2023-10-25',
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
    purchaseDate: '2023-11-01',
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
    purchaseDate: '2023-11-08',
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
    purchaseDate: '2023-11-15',
    cover:
      'https://www.dropbox.com/scl/fi/esmrg6k9gs306ks8o9rkr/4.png?rlkey=sn16mxcyehwivxsr062flty8p&st=04dz0gjf&raw=1',
  },
  {
    id: 105,
    title: '屋敷のイを億万オーラルー',
    author: '伊藤貴文',
    isbn: '978-4-00-555555-5',
    tags: ['t5'],
    review: 'マンガ。',
    purchaseDate: '2023-11-22',
    cover:
      'https://www.dropbox.com/scl/fi/i5wdv41gtgcobf4nwgcqj/5.png?rlkey=slol40rvlq3jnq10tkabq0tn6&st=uf257zie&raw=1',
  },
  {
    id: 106,
    title: 'あの夏を傍ら外観',
    author: '鄭醤夷',
    isbn: '978-4-00-666666-6',
    tags: ['t2'],
    review: 'ファウンデーションシリーズ。',
    purchaseDate: '2023-11-29',
    cover:
      'https://www.dropbox.com/scl/fi/vt2clrd34cs9hvcvdw3tt/6.png?rlkey=rhqgzd5jz7mkkkdvipvzuh6zq&st=i8uqwghp&raw=1',
  },
  {
    id: 201,
    title: '夜明けに説を初詣',
    author: '菅野大輔',
    isbn: '978-4-00-777777-7',
    tags: ['t3'],
    review: '',
    purchaseDate: '2023-12-06',
    cover:
      'https://www.dropbox.com/scl/fi/wg684ba7v6y26yyveg9v9/7.png?rlkey=2a21ow3own0k3fk11tcmtu4mt&st=1gznp059&raw=1',
  },
  {
    id: 202,
    title: '是の俊な内裏う',
    author: '高相 妻木',
    isbn: '978-4-00-888888-8',
    tags: ['t4'],
    review: '利己的な遺伝子。',
    purchaseDate: '2023-12-13',
    cover:
      'https://www.dropbox.com/scl/fi/tn4sdmng930e9x8kvqvjk/8.png?rlkey=w1fz74ujcqnhol4h6fmuofqcq&st=mv9b6n6c&raw=1',
  },
];

// --- トースト用の型定義 ---
type ToastType = {
  message: string;
  visible: boolean;
};

// --- トーストコンポーネント ---
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
      }, 3000);
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

// --- コンポーネント ---
interface BookCardProps {
  book: BookType;
  onEdit: (book: BookType) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit }) => {
  return (
    <div className="flex flex-col h-full relative">
      <div className="group cursor-pointer" onClick={() => onEdit(book)}>
        <div className="aspect-[7/10] w-full mb-3 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 relative bg-gray-200">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      <div className="flex justify-between items-start mt-1 relative">
        <div className="flex-grow">
          <h3 className="font-bold text-gray-800 text-sm line-clamp-2 group-hover:text-blue-700 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1 mt-1">
            {book.author}
          </p>
        </div>
      </div>
    </div>
  );
};

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookToEdit?: BookType | null;
  onDelete: (book: BookType) => void;
  onSave: (book: BookType, isEditMode: boolean) => void;
}

const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  onClose,
  bookToEdit = null,
  onDelete,
  onSave,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    bookToEdit?.tags || []
  );
  const [title, setTitle] = useState(bookToEdit?.title || '');
  const [author, setAuthor] = useState(bookToEdit?.author || '');
  const [isbn, setIsbn] = useState(bookToEdit?.isbn || '');
  const [purchaseDate, setPurchaseDate] = useState(
    bookToEdit?.purchaseDate || ''
  );
  const [review, setReview] = useState(bookToEdit?.review || '');

  useEffect(() => {
    if (isOpen) {
      setSelectedTags(bookToEdit?.tags || []);
      setTitle(bookToEdit?.title || '');
      setAuthor(bookToEdit?.author || '');
      setIsbn(bookToEdit?.isbn || '');
      setPurchaseDate(bookToEdit?.purchaseDate || '');
      setReview(bookToEdit?.review || '');
    }
  }, [isOpen, bookToEdit]);

  if (!isOpen) return null;

  const isEditMode = !!bookToEdit;

  const handleTagChange = (tagId: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId)
        ? prevTags.filter((id) => id !== tagId)
        : [...prevTags, tagId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            {isEditMode ? (
              <Edit className="w-5 h-5 mr-2 text-blue-600" />
            ) : (
              <Book className="w-5 h-5 mr-2 text-blue-600" />
            )}
            {isEditMode ? '図書情報の編集' : '図書の新規登録'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-start">
              {isEditMode && bookToEdit?.cover ? (
                <div className="w-full aspect-[7/10] rounded-lg overflow-hidden shadow-md relative group">
                  <img
                    src={bookToEdit.cover}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-transparent group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-full font-medium text-sm shadow-sm hover:bg-gray-100 transition-all">
                      画像を変更
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[7/10] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors">
                  <BookOpen size={48} className="mb-2 opacity-50" />
                  <span className="text-sm font-medium">
                    書影をアップロード
                  </span>
                  <span className="text-xs mt-1">またはドラッグ＆ドロップ</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="例: 星を継ぐもの"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  著者名
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="例: ジェイムズ・P・ホーガン"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="例: 978-4-..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    購入日
                  </label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タグ選択
                </label>
                <div className="max-h-28 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {MOCK_TAGS.map((tag) => (
                      <label
                        key={tag.id}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.id)}
                          onChange={() => handleTagChange(tag.id)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {tag.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  感想文
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-32 resize-none"
                  placeholder="感想やメモを入力..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sticky bottom-0 z-10">
          <div>
            {isEditMode && bookToEdit && (
              <button
                onClick={() => {
                  onDelete(bookToEdit);
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-red-300 text-red-600 font-medium hover:bg-red-100 hover:border-red-400 transition-colors flex items-center justify-center"
              >
                <Trash2 size={16} className="mr-1.5" />
                <span className="whitespace-nowrap">削除する</span>
              </button>
            )}
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              キャンセル
            </button>
            <button
              onClick={() => {
                const bookData: BookType = {
                  id: isEditMode ? bookToEdit!.id : Date.now(),
                  title,
                  author,
                  isbn,
                  tags: selectedTags,
                  review,
                  purchaseDate,
                  cover: isEditMode ? bookToEdit!.cover : '',
                };
                onSave(bookData, isEditMode);
                onClose();
              }}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap"
            >
              {isEditMode ? '更新する' : '登録する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookToDelete: BookType | null;
  onConfirmDelete: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  bookToDelete,
  onConfirmDelete,
}) => {
  if (!isOpen || !bookToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            図書を削除しますか?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            「
            <span className="font-medium text-gray-700">
              {bookToDelete.title}
            </span>
            」
            <br />
            を削除しようとしています。この操作は取り消せません。本当に削除してもよろしいですか?
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              キャンセル
            </button>
            <button
              onClick={() => {
                onConfirmDelete();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap"
            >
              削除する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TagListManagementProps {
  onTagClick: (tag: TagType) => void;
  selectedTagId?: string | null;
}

const TagListManagement: React.FC<TagListManagementProps> = ({
  onTagClick,
  selectedTagId = null,
}) => {
  const [tags, setTags] = useState<TagType[]>(MOCK_TAGS);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [deletingTagId, setDeletingTagId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTagName, setTempTagName] = useState('');

  const handleEditStart = (tag: TagType) => {
    setEditingTagId(tag.id);
    setTempTagName(tag.name);
    setDeletingTagId(null);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempTagName.trim()) return;
    setTags(
      tags.map((t) => (t.id === editingTagId ? { ...t, name: tempTagName } : t))
    );
    setEditingTagId(null);
    setTempTagName('');
  };

  const handleTrashClick = (tagId: string) => {
    setDeletingTagId(deletingTagId === tagId ? null : tagId);
    setEditingTagId(null);
  };

  const handleDeleteConfirm = (tagId: string) => {
    setTags(tags.filter((t) => t.id !== tagId));
    setDeletingTagId(null);
  };

  const handleAddStart = () => {
    setIsAdding(true);
    setTempTagName('');
    setEditingTagId(null);
    setDeletingTagId(null);
  };

  const handleAddSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempTagName.trim()) {
      setIsAdding(false);
      return;
    }
    const newTag: TagType = { id: `t${Date.now()}`, name: tempTagName };
    setTags([...tags, newTag]);
    setIsAdding(false);
    setTempTagName('');
  };

  return (
    <div>
      <ul className="bg-white rounded-lg shadow border border-gray-100 divide-y divide-gray-100">
        {tags.map((tag) => (
          <li
            key={tag.id}
            className="relative overflow-hidden transition-all duration-300"
          >
            <div
              className={`flex items-center w-full transition-transform duration-300 ${
                deletingTagId === tag.id ? '-translate-x-20' : 'translate-x-0'
              }`}
            >
              <div className="flex-grow">
                {editingTagId === tag.id ? (
                  <form onSubmit={handleEditSave} className="flex p-4">
                    <Tag className="w-5 h-5 mr-3 text-gray-400 shrink-0 mt-2" />
                    <input
                      type="text"
                      value={tempTagName}
                      onChange={(e) => setTempTagName(e.target.value)}
                      onBlur={handleEditSave}
                      autoFocus
                      className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </form>
                ) : (
                  <div
                    className={`flex items-center p-4 cursor-pointer group transition-colors ${
                      selectedTagId === tag.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onTagClick(tag)}
                  >
                    <Tag
                      className={`w-5 h-5 mr-3 ${
                        selectedTagId === tag.id
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-blue-600'
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        selectedTagId === tag.id
                          ? 'text-blue-600'
                          : 'text-gray-700 group-hover:text-blue-600'
                      }`}
                    >
                      {tag.name}
                    </span>
                  </div>
                )}
              </div>

              {!editingTagId && (
                <div className="flex shrink-0 px-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStart(tag);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="編集"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTrashClick(tag.id);
                    }}
                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                      deletingTagId === tag.id
                        ? 'text-red-600 bg-red-100'
                        : 'text-gray-400 hover:text-red-600'
                    }`}
                    aria-label="削除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            <div
              className={`absolute top-0 right-0 h-full w-20 bg-red-600 text-white flex items-center justify-center cursor-pointer
                         transition-transform duration-300 ${
                           deletingTagId === tag.id
                             ? 'translate-x-0'
                             : 'translate-x-full'
                         }`}
              onClick={() => handleDeleteConfirm(tag.id)}
            >
              削除
            </div>
          </li>
        ))}

        <li className="p-4">
          {isAdding ? (
            <form onSubmit={handleAddSave} className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={tempTagName}
                onChange={(e) => setTempTagName(e.target.value)}
                onBlur={handleAddSave}
                autoFocus
                placeholder="新しいタグ名"
                className="grow px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 min-w-0"
              />
              <button
                type="submit"
                className="shrink-0 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                title="保存"
                aria-label="保存"
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="shrink-0 p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                title="キャンセル"
                aria-label="キャンセル"
              >
                <X size={16} />
              </button>
            </form>
          ) : (
            <button
              onClick={handleAddStart}
              className="w-full text-left text-blue-600 font-medium hover:text-blue-700 flex items-center group"
            >
              <Plus
                size={16}
                className="mr-2 p-0.5 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-200"
              />
              新規タグを追加
            </button>
          )}
        </li>
      </ul>
    </div>
  );
};

interface BookListItemProps {
  book: BookType;
}

const BookListItem: React.FC<BookListItemProps> = ({ book }) => {
  return (
    <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
      <img
        src={book.cover}
        alt={book.title}
        className="w-12 h-16 object-cover rounded shadow-sm shrink-0"
      />
      <div className="grow overflow-hidden">
        <p className="font-semibold text-gray-800 truncate">{book.title}</p>
        <p className="text-sm text-gray-500 truncate">{book.author}</p>
      </div>
    </div>
  );
};

interface TagBooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag: TagType | null;
  allBooks: BookType[];
}

const TagBooksModal: React.FC<TagBooksModalProps> = ({
  isOpen,
  onClose,
  tag,
  allBooks,
}) => {
  if (!isOpen || !tag) return null;

  const taggedBooks = allBooks.filter(
    (book) => book.tags && book.tags.includes(tag.id)
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Tag className="w-5 h-5 mr-2 text-blue-600" />
            タグ: {tag.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grow">
          <h4 className="text-lg font-bold text-gray-800 mb-4">関連する図書</h4>
          {taggedBooks.length > 0 ? (
            <div className="space-y-2">
              {taggedBooks.map((book) => (
                <BookListItem key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              このタグが付いた本はありません。
            </p>
          )}
        </div>

        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

type SortOption = 'newest' | 'title' | 'author';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'books' | 'tags';
  onTabChange: (tab: 'books' | 'tags') => void;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
}) => {
  const handleTabClick = (tab: 'books' | 'tags') => {
    onTabChange(tab);
    onClose();
  };

  return (
    <>
      {/* オーバーレイ */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* ドロワー */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">メニュー</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4">
          <button
            onClick={() => handleTabClick('books')}
            className={`w-full flex items-center px-4 py-3 rounded-lg mb-2 transition-all ${
              activeTab === 'books'
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <LayoutGrid className="w-5 h-5 mr-3" />
            図書一覧
          </button>
          <button
            onClick={() => handleTabClick('tags')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              activeTab === 'tags'
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Tags className="w-5 h-5 mr-3" />
            タグ一覧
          </button>
        </nav>
      </div>
    </>
  );
};

export default function ObjectOrientedUI() {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [activeTab, setActiveTab] = useState<'books' | 'tags'>('books');
  const [isBookFormModalOpen, setIsBookFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [isTagBooksModalOpen, setIsTagBooksModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [books, setBooks] = useState<BookType[]>(MOCK_ALL_BOOKS);
  const [toast, setToast] = useState<ToastType>({
    message: '',
    visible: false,
  });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };

  const hideToast = () => {
    setToast({ message: '', visible: false });
  };

  const sortedBooks = useMemo(() => {
    const booksCopy = [...books];
    switch (sortBy) {
      case 'newest':
        return booksCopy.sort(
          (a, b) =>
            new Date(b.purchaseDate).getTime() -
            new Date(a.purchaseDate).getTime()
        );
      case 'title':
        return booksCopy.sort((a, b) => a.title.localeCompare(b.title, 'ja'));
      case 'author':
        return booksCopy.sort((a, b) => a.author.localeCompare(b.author, 'ja'));
      default:
        return booksCopy;
    }
  }, [sortBy, books]);

  const handleRegisterClick = () => {
    setSelectedBook(null);
    setIsBookFormModalOpen(true);
  };

  const handleEditClick = (book: BookType) => {
    setSelectedBook(book);
    setIsBookFormModalOpen(true);
  };

  const handleDeleteClick = (book: BookType) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const handleSaveBook = (book: BookType, isEditMode: boolean) => {
    if (isEditMode) {
      setBooks(books.map((b) => (b.id === book.id ? book : b)));
      showToast('図書情報を更新しました');
    } else {
      setBooks([...books, book]);
      showToast('図書を登録しました');
    }
  };

  const handleConfirmDelete = () => {
    if (selectedBook) {
      setBooks(books.filter((b) => b.id !== selectedBook.id));
      showToast('図書を削除しました');
    }
  };

  const handleTagClick = (tag: TagType) => {
    setSelectedTag(tag);
    // SPの場合のみモーダルを開く(mdサイズ以上では開かない)
    const isMobile = window.innerWidth < 768; // Tailwindのmd breakpoint
    if (isMobile) {
      setIsTagBooksModalOpen(true);
    }
  };

  const HeaderTabs = () => (
    <div className="flex -mb-px h-full">
      <button
        onClick={() => setActiveTab('books')}
        className={`flex items-center px-4 md:px-5 py-2 text-sm font-semibold transition-all h-full ${
          activeTab === 'books'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-gray-300'
        }`}
      >
        <LayoutGrid className="w-4 h-4 mr-2" />
        図書一覧
      </button>
      <button
        onClick={() => setActiveTab('tags')}
        className={`flex items-center px-4 md:px-5 py-2 text-sm font-semibold transition-all h-full ${
          activeTab === 'tags'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-gray-300'
        }`}
      >
        <Tags className="w-4 h-4 mr-2" />
        タグ一覧
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900 relative">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* ハンバーガーメニュー（モバイルのみ） */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="メニューを開く"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="shrink-0 flex items-center space-x-3 group">
            <div className="bg-blue-600 p-2 rounded-lg shadow-md">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-md md:text-lg font-bold text-gray-800 tracking-tight">
                自宅本棚管理アプリ
              </h1>
              <p className="text-xs text-gray-500 hidden md:block -mt-1">
                My Personal Library
              </p>
            </div>
          </div>

          {/* justify-between で真ん中にロゴが来るように、空のdivを配置 */}
          <div></div>

          {/* デスクトップ用タブ */}
          <div className="grow hidden md:flex justify-end items-center px-4 h-full">
            <HeaderTabs />
          </div>
        </div>
      </header>

      {/* ドロワー */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-6xl">
        {activeTab === 'books' && (
          <section>
            <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="relative max-w-3xl mx-auto">
                <input
                  type="text"
                  className="w-full pl-14 pr-6 py-3 text-base rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none shadow-sm"
                  placeholder="フリーワード検索"
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button className="absolute right-2.5 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-full font-bold transition-colors text-sm">
                  検索
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center mb-4 sm:mb-0">
                <LayoutGrid className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">図書一覧</h2>
                <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {sortedBooks.length} 件
                </span>
              </div>

              <div className="flex items-center space-x-2 bg-white p-1 rounded-lg shadow-sm border border-gray-100">
                <span className="text-sm text-gray-500 px-2 hidden sm:inline">
                  並び替え:
                </span>
                <button
                  onClick={() => setSortBy('newest')}
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    sortBy === 'newest'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ArrowDownWideNarrow className="w-4 h-4 mr-1.5" />
                  購入日順
                </button>
                <button
                  onClick={() => setSortBy('title')}
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    sortBy === 'title'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ArrowDownAZ className="w-4 h-4 mr-1.5" />
                  タイトル
                </button>
                <button
                  onClick={() => setSortBy('author')}
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    sortBy === 'author'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <UserRound className="w-4 h-4 mr-1.5" />
                  著者名
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {sortedBooks.map((book) => (
                <BookCard key={book.id} book={book} onEdit={handleEditClick} />
              ))}
            </div>
          </section>
        )}

        {activeTab === 'tags' && (
          <section className="animate-in fade-in duration-300">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
              <Tags className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">タグ管理</h2>
            </div>

            {/* SP表示: タグ一覧のみ */}
            <div className="md:hidden max-w-3xl mx-auto">
              <TagListManagement
                onTagClick={handleTagClick}
                selectedTagId={selectedTag?.id}
              />
            </div>

            {/* PC表示: 左右分割レイアウト */}
            <div className="hidden md:grid md:grid-cols-5 gap-6">
              {/* 左側: タグ一覧 (2カラム分) */}
              <div className="md:col-span-2">
                <TagListManagement
                  onTagClick={handleTagClick}
                  selectedTagId={selectedTag?.id}
                />
              </div>

              {/* 右側: 選択されたタグの本一覧 (3カラム分) */}
              <div className="md:col-span-3">
                {selectedTag ? (
                  <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
                    <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
                      <Tag className="w-5 h-5 mr-2 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-800">
                        {selectedTag.name}
                      </h3>
                      <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {
                          MOCK_ALL_BOOKS.filter(
                            (book) =>
                              book.tags && book.tags.includes(selectedTag.id)
                          ).length
                        }{' '}
                        件
                      </span>
                    </div>
                    <div className="space-y-2">
                      {MOCK_ALL_BOOKS.filter(
                        (book) =>
                          book.tags && book.tags.includes(selectedTag.id)
                      ).length > 0 ? (
                        MOCK_ALL_BOOKS.filter(
                          (book) =>
                            book.tags && book.tags.includes(selectedTag.id)
                        ).map((book) => (
                          <BookListItem key={book.id} book={book} />
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          このタグが付いた本はありません。
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow border border-gray-100 p-12 text-center">
                    <Tag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      左側のタグを選択すると、関連する図書が表示されます
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-auto z-20">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} honokiyuto. All rights reserved.
          </p>
        </div>
      </footer>

      {activeTab === 'books' && (
        <button
          onClick={handleRegisterClick}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 group border border-white-700 animate-in fade-in zoom-in"
          aria-label="新規追加"
        >
          <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={hideToast}
      />

      <BookFormModal
        isOpen={isBookFormModalOpen}
        onClose={() => setIsBookFormModalOpen(false)}
        bookToEdit={selectedBook}
        onDelete={handleDeleteClick}
        onSave={handleSaveBook}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        bookToDelete={selectedBook}
        onConfirmDelete={handleConfirmDelete}
      />

      <TagBooksModal
        isOpen={isTagBooksModalOpen}
        onClose={() => setIsTagBooksModalOpen(false)}
        tag={selectedTag}
        allBooks={books}
      />
    </div>
  );
}
