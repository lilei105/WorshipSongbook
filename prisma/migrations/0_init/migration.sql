-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "by" VARCHAR,
    "note" VARCHAR,
    "sheet_url" VARCHAR,
    "audio_url" VARCHAR,
    "songlist_id" INTEGER,

    CONSTRAINT "song_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Songlist" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "date" DATE,

    CONSTRAINT "songlist_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "song_fk" FOREIGN KEY ("songlist_id") REFERENCES "Songlist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

