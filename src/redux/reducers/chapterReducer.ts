import {PayloadAction, createSlice} from '@reduxjs/toolkit';

type Chapter = {
  id: string;
  name: String;
  views: any;
};

export type ChapterState = {
  chapterId: string | null;
  chapterList: Chapter[];
};

const initialState: ChapterState = {
  chapterId: null,
  chapterList: [],
};

const chapterSlice = createSlice({
  name: 'chapter',
  initialState,
  reducers: {
    setChapterId: (state, action: PayloadAction<string>) => {
      state.chapterId = action.payload;
    },
    setChapterList: (state, action: PayloadAction<Chapter[]>) => {
      state.chapterList = action.payload;
    },
  },
});

export const {setChapterId, setChapterList} = chapterSlice.actions;
export default chapterSlice.reducer;
